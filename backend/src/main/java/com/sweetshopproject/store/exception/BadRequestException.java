package com.sweetshopproject.store.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Data
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
@EqualsAndHashCode(callSuper = true)
public class BadRequestException extends Exception {

    final String     message;
    final String     localMessage;
    final HttpStatus status;

    public BadRequestException(String message, String localMessage, HttpStatus status){

        super(message);
        this.setStackTrace(new StackTraceElement[0]);
        this.localMessage = localMessage;
        this.message      = message;
        this.status       = status;

    }
}
