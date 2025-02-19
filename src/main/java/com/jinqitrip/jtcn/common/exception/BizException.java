package com.jinqitrip.jtcn.common.exception;

import lombok.RequiredArgsConstructor;

public class BizException extends RuntimeException {
    private final int code;
    
    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
