package com.pink.itms.config.security;

import java.util.Base64;

/**
 * Base64로 인코딩된 JWT 시크릿 생성
 */
public class GenerateBase64Secret {
    public static void main(String[] args) {
        String secret = "your_jwt_secret";
        String base64Secret = Base64.getEncoder().encodeToString(secret.getBytes());
        System.out.println(base64Secret);
    }
}
