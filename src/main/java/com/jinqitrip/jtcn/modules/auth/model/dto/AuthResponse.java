package com.jinqitrip.jtcn.modules.auth.model.dto;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String access_token;
    private String refresh_token;
    private String token_type;
    private long expires_in;
    private String scope;
}
