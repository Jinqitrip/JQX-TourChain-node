package com.jinqitrip.jtcn.modules.auth.service;

import com.jinqitrip.jtcn.common.exception.BizException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jinqitrip.jtcn.common.utils.JwtUtil;
import com.jinqitrip.jtcn.common.response.Result;
import com.jinqitrip.jtcn.common.response.AuthResponse;
import com.jinqitrip.jtcn.modules.auth.model.dto.LoginRequest;
import com.jinqitrip.jtcn.modules.auth.repository.UserRepository;
import com.jinqitrip.jtcn.modules.auth.entity.User;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    // 接收一个LoginRequest对象，包含用户名和密码
    public Result<AuthResponse> login(LoginRequest request) {

        // 查询数据库，查找用户名匹配的用户
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new BizException(400, "用户不存在"));
        
        // 验证密码是否匹配
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new BizException(400, "密码错误");
        }
        
        // 生成一个JWT，其中包含用户的用户名
        String token = jwtUtil.generateToken(user.getUsername());

        // 返回一个包含JWT的响应
        return Result.success(new AuthResponse(token));
    }
}
