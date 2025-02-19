package com.jinqitrip.jtcn.modules.guide.service;

import com.jinqitrip.jtcn.modules.guide.model.dto.GuideVerifyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.List;
import java.time.LocalDateTime;

import com.jinqitrip.jtcn.modules.guide.model.Guide;


@Service
@Transactional
@RequiredArgsConstructor
public class GuideVerifyService {
    // 通过一些方法来处理审核请求

    public void verifyGuide(GuideVerifyRequest request) {
        // 审核导游请求的逻辑
    }
}