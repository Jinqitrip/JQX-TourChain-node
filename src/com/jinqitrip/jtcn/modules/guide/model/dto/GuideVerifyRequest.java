package com.jinqitrip.jtcn.modules.guide.model.dto;

@Data
public class GuideVerifyRequest {
    @NotBlank
    private String studentId;
    
    @NotBlank
    private String idCardFront;
    
    @URL
    private String tourGuideCert;
}