package com.jinqitrip.jtcn.modules.auth.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class SecurityConfig {
    /**
     * 直接创建并返回一个 BCryptPasswordEncoder 实例
     *
     * @return BCryptPasswordEncoder 实例
     */
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}