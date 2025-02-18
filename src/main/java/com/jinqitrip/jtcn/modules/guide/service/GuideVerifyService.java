package com.jinqitrip.jtcn.modules.guide.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.List;
import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class GuideVerifyService {
    private final GuideRepository guideRepo;
    private final OcrService ocrService;

    public void processVerification(GuideVerifyRequest request) {
        // OCR识别证件
        CertInfo certInfo = ocrService.parseCert(request.getTourGuideCert());
        
        Guide guide = new Guide();
        guide.setStudentId(request.getStudentId());
        guide.setIdCardFront(request.getIdCardFront());
        guide.setTourGuideCert(request.getTourGuideCert());
        guide.getAuditLogs().add(new AuditLog("提交初审", LocalDateTime.now()));
        
        guideRepo.save(guide);
    }

    @Scheduled(cron = "0 0 9 * * ?") // 每天上午9点推进审核
    public void autoAdvanceStatus() {
        guideRepo.findByStatusIn(List.of(PENDING_INITIAL, DEPARTMENT_REVIEW))
               .forEach(guide -> {
                   guide.setStatus(guide.getStatus().next());
                   guide.getAuditLogs().add(new AuditLog(
                       "自动推进至：" + guide.getStatus().name(),
                       LocalDateTime.now()
                   ));
               });
    }
}