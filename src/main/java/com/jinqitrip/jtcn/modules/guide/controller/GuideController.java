package com.jinqitrip.jtcn.modules.guide.controller;

import com.jinqitrip.jtcn.common.response.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jinqitrip.jtcn.modules.guide.service.GuideVerifyService;
import com.jinqitrip.jtcn.modules.guide.model.dto.GuideVerifyRequest;



@RestController
@RequestMapping("/api/campus/guides")
@RequiredArgsConstructor
public class GuideController {
    private final GuideVerifyService verifyService;

    @PostMapping("/verify")
    public Result<?> submitVerification(@RequestBody @Valid GuideVerifyRequest request) {
        verifyService.processVerification(request);
        return Result.success("审核已提交");
    }
}