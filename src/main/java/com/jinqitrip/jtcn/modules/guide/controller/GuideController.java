package com.jinqitrip.jtcn.modules.guide.controller;

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