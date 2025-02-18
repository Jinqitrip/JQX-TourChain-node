package com.jinqitrip.jtcn.common.exception;

public class BizException extends RuntimeException {
    private final int code;
    
    public BizException(int code, String message) {
        super(message);
        this.code = code;
    }
}
