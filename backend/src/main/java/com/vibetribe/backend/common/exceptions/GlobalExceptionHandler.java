package com.vibetribe.backend.common.exceptions;

import com.vibetribe.backend.common.response.ApiResponse;
import lombok.extern.java.Log;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Log
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleDataAccessException(DataAccessException exception) {
        return ApiResponse.failedResponse(exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException exception) {
        String rootCauseMessage = exception.getRootCause() != null ? exception.getRootCause().getMessage() : "Data integrity violation";
        return ApiResponse.failedResponse("Data integrity violation: " + rootCauseMessage);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<?> handleDuplicateEmailException(DuplicateEmailException exception) {
        return ApiResponse.failedResponse("Email already exists");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException exception) {
        return ApiResponse.failedResponse(HttpStatus.UNAUTHORIZED.value(), "Access denied");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        String errorMessage = exception.getBindingResult().getFieldError().getDefaultMessage();
        return ApiResponse.failedResponse(errorMessage);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception exception) {
        return ApiResponse.failedResponse(exception.getMessage());
    }
}
