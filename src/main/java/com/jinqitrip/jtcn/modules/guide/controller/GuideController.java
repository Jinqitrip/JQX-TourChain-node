package com.jinqitrip.jtcn.modules.guide.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jinqitrip.jtcn.modules.guide.service.GuideVerifyService;
import com.jinqitrip.jtcn.modules.guide.model.dto.GuideVerifyRequest;
import com.jinqitrip.jtcn.common.response.Result;

@RestController
@RequestMapping("/api/campus/guides")
@RequiredArgsConstructor
public class GuideController {
    private final GuideVerifyService verifyService;

    // 接收客户端发送的 POST 请求
    @PostMapping("/verify")
    public Result<?> submitVerification(@RequestBody @Valid GuideVerifyRequest request) {

        // 调用 GuideVerifyService 的 verifyGuide 方法进行审核操作
        verifyService.verifyGuide(request);

        // 返回一个成功的响应结果，提示审核已提交
        return Result.success("审核已提交");
    }
}