package com.jinqitrip.jtcn.common.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.RedisTemplate;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

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

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .header().type("JWT").and()
                .subject(user.getUsername())
                .claim("roles", user.getRoles())
                .claim("deviceId", user.getCurrentDeviceId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000)) // 1小时
                .signWith(SECRET_KEY)
                .compact();
    }
    
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .expiration(new Date(System.currentTimeMillis() + 2592000000L)) // 30天
                .signWith(SECRET_KEY)
                .compact();
    }
}
