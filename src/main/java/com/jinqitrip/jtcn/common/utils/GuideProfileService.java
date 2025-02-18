package com.jinqitrip.jtcn.common.utils;

public class MediaValidator {
    private static final double TARGET_RATIO = 4.0 / 3.0;
    private static final double RATIO_TOLERANCE = 0.01;

    public static boolean validateMedia(List<MediaFile> files) {
        return files.stream().allMatch(file -> {
            if (file.getType() == MediaType.VIDEO) {
                return file.getDuration() <= 30;
            } else if (file.getType() == MediaType.IMAGE) {
                return Math.abs(file.getWidth()/(double)file.getHeight() - TARGET_RATIO) < RATIO_TOLERANCE;
            }
            return false;
        });
    }
}

// 使用示例
public class GuideProfileService {
    public void updateProfile(List<MediaFile> files) {
        if (!MediaValidator.validateMedia(files)) {
            throw new BizException(400, "媒体文件不符合规格");
        }
        // 保存逻辑...
    }
}