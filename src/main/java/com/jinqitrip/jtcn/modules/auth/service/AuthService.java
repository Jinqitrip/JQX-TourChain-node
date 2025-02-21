package com.jinqitrip.jtcn.modules.auth.service;

import com.jinqitrip.jtcn.common.exception.BizException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jinqitrip.jtcn.common.utils.JwtUtil;
import com.jinqitrip.jtcn.common.response.Result;
import com.jinqitrip.jtcn.common.response.AuthResponse;
import com.jinqitrip.jtcn.modules.auth.model.dto.LoginRequest;
import com.jinqitrip.jtcn.modules.auth.model.dto.RegisterRequest;
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

    public AuthResponse login(LoginRequest request) {
    // 1. 执行Spring Security认证
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(), 
            request.getPassword()
        )
    );
    
    // 2. 生成双令牌
    User user = (User) authentication.getPrincipal();
    String accessToken = jwtUtil.generateAccessToken(user);
    String refreshToken = jwtUtil.generateRefreshToken(user);
    
    // 3. 记录设备登录信息
    deviceService.recordLoginDevice(user.getId(), request.getDeviceId());
    
    // 4. 返回标准OAuth2响应
    return new AuthResponse(
        accessToken,
        refreshToken,
        "Bearer",
        jwtUtil.getAccessTokenExpiration().getSeconds(),
        "read write"
    );

    
    @Transactional
    public Result<?> register(RegisterRequest request) {
        // 1. 验证短信验证码
        if (!smsService.validateCode(request.getPhone(), request.getSmsCode())) {
            throw new BizException(400, "验证码错误或已过期");
        }

        // 2. 检查用户名唯一性
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new BizException(409, "用户名已被注册");
        }

        // 3. 创建用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setStatus(UserStatus.INACTIVE); // 需要激活

        // 4. 保存到数据库
        User savedUser = userRepo.save(user);
        
        // 5. 发送激活邮件/短信（异步）
        asyncService.sendActivation(savedUser);

        return Result.success("注册成功，请查收激活邮件");
    }
    }

}


