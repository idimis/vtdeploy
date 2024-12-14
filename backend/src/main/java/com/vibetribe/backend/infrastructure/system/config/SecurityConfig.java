package com.vibetribe.backend.infrastructure.system.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.vibetribe.backend.infrastructure.system.security.JwtAuthenticationFilter;
import com.vibetribe.backend.infrastructure.usecase.user.auth.service.GetUserAuthDetailsUsecase;
import lombok.extern.java.Log;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Log
public class SecurityConfig {

    private final JwtDecoder jwtDecoder;
    private final GetUserAuthDetailsUsecase getUserAuthDetailsUsecase;
    private final PasswordEncoder passwordEncoder;
    private final RsaKeyConfigProperties rsaKeyConfigProperties;

    public SecurityConfig(@Lazy AuthenticationManager authenticationManager, JwtDecoder jwtDecoder, GetUserAuthDetailsUsecase getUserAuthDetailsUsecase , RsaKeyConfigProperties rsaKeyConfigProperties, PasswordEncoder passwordEncoder) {
        this.jwtDecoder = jwtDecoder;
        this.getUserAuthDetailsUsecase = getUserAuthDetailsUsecase;
        this.passwordEncoder = passwordEncoder;
        this.rsaKeyConfigProperties = rsaKeyConfigProperties;
    }

    @Bean
    public AuthenticationManager authManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(getUserAuthDetailsUsecase);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
                .authorizeHttpRequests(authorize -> authorize
                        // public endpoint
                        .requestMatchers("/api/v1/signup").permitAll()
                        .requestMatchers("/api/v1/login").permitAll()
                        .requestMatchers("/api/v1/events/**").permitAll()
                        .requestMatchers("/api/v1/reviews/**").permitAll()
                        .requestMatchers("/api/v1/vouchers/**").permitAll()
                        .requestMatchers("/api/v1/locations").permitAll()
                        .requestMatchers("/api/v1/users/**").permitAll()
                        // private endpoint
                        .anyRequest().authenticated()
                )
                .addFilter(new JwtAuthenticationFilter(authManager(), jwtDecoder));
        return http.build();
    }

    @Bean
    JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(rsaKeyConfigProperties.publicKey()).privateKey(rsaKeyConfigProperties.privateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }
}