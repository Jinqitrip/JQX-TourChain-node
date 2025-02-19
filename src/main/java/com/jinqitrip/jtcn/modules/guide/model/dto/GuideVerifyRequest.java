package com.jinqitrip.jtcn.modules.guide.model.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

@Data
public class GuideVerifyRequest {
    @NotBlank
    private String studentId;
    
    @NotBlank
    private String idCardFront;
    
    @URL
    private String tourGuideCert;
}