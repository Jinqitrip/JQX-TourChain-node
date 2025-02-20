package com.jinqitrip.jtcn.common.config;

public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
