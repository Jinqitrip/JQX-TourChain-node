package com.jinqitrip.jtcn.common.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtil {
    private final RedisTemplate<String, String> redisTemplate;
    private final static SecretKey SECRET_KEY = Keys.hmacShaKeyFor("your-256-bit-secret".getBytes());

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .expiration(new Date(System.currentTimeMillis() + 3600000)) // 1小时
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token);
            return !redisTemplate.hasKey("jwt_blacklist:" + token);
        } catch (JwtException e) {
            return false;
        }
    }
}
