package com.jinqitrip.jtcn.common.exception;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BizException.class)
    public Result<?> handleBizException(BizException e) {
        return Result.error(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<?> handleGlobalException(Exception e) {
        return Result.error(500, "系统繁忙");
    }
}