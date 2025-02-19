package com.jinqitrip.jtcn.modules.guide.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

@Entity
@Data
public class Guide {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    
    private String studentId;
    private String idCardFront; // Base64存储或文件路径
    private String tourGuideCert;
    
    @Enumerated(STRING)
    private VerifyStatus status = VerifyStatus.PENDING_INITIAL;
    
    @ElementCollection
    private List<AuditLog> auditLogs = new ArrayList<>();
}

