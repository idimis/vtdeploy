package com.vibetribe.backend.common.util;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

public class ReferralCodeGenerator {
    private static final SecureRandom random = new SecureRandom();
    private static final int RANDOM_STRING_LENGTH = 8;

    public static String generateReferralCode(String email) {
        String timestamp = Long.toString(Instant.now().toEpochMilli(), 36);
        String randomString = generateRandomString(RANDOM_STRING_LENGTH);
        return timestamp + randomString;
    }

    private static String generateRandomString(int length) {
        byte[] randomBytes = new byte[length];
        random.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
