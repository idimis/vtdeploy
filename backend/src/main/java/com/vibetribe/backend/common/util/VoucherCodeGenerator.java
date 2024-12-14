package com.vibetribe.backend.common.util;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

public class VoucherCodeGenerator {
    private static final SecureRandom random = new SecureRandom();
    private static final int CODE_LENGTH = 12;

    public static String generateVoucherCode() {
        String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, CODE_LENGTH);
        byte[] randomBytes = new byte[CODE_LENGTH];
        random.nextBytes(randomBytes);
        String randomString = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes).substring(0, CODE_LENGTH);
        return uuid + randomString;
    }
}
