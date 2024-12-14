package com.vibetribe.backend.infrastructure.system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class JwtDecoderConfig {
    private final RsaKeyConfigProperties rsaKeyConfigProperties;

    public JwtDecoderConfig(RsaKeyConfigProperties rsaKeyConfigProperties) {
        this.rsaKeyConfigProperties = rsaKeyConfigProperties;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaKeyConfigProperties.publicKey()).build();
    }
}
