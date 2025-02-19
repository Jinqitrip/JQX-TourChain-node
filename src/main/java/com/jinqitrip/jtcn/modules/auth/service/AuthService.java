package com.jinqitrip.jtcn.modules.auth.service;

import com.jinqitrip.jtcn.common.exception.BizException;
import org.springframework.stereotype.Service;

import com.jinqitrip.jtcn.common.utils.JwtUtil;
import com.jinqitrip.jtcn.common.response.Result;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public Result<AuthResponse> login(LoginRequest request) {
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new BizException(400, "用户不存在"));
        
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new BizException(400, "密码错误");
        }
        
        String token = jwtUtil.generateToken(user.getUsername());
        return Result.success(new AuthResponse(token));
    }
}