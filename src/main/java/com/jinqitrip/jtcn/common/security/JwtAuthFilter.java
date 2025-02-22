package com.jinqitrip.jtcn.common.security;

public class JwtAuthFilter extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response,
                                   FilterChain chain) throws IOException, ServletException {
        // 1. 从Header提取令牌
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            
            // 2. 验证令牌有效性
            if (jwtUtil.validateToken(token)) {
                // 3. 检查设备绑定
                String currentDevice = jwtUtil.extractDeviceId(token);
                if (!deviceService.validateDevice(
                        jwtUtil.extractUsername(token), currentDevice)) {
                    throw new DeviceMismatchException("设备授权已变更");
                }
                
                // 4. 设置安全上下文
                Authentication auth = jwtUtil.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}