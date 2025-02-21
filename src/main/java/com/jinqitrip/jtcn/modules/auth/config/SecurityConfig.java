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

@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}

// 配置密码模式端点
@Bean
public AuthorizationServerSettings authorizationServerSettings() {
    return AuthorizationServerSettings.builder()
            .tokenEndpoint("/api/v1/auth/login")
            .build();
}