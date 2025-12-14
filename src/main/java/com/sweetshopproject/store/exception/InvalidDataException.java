package com.sweetshopproject.store.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@Data
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
@EqualsAndHashCode(callSuper = true)
public class InvalidDataException extends Exception {

    private final String     localMessage;
    private final String     message;
    private final HttpStatus stat;

    public InvalidDataException(String message, String localMessage){

        this.setStackTrace(new StackTraceElement[0]);
        this.localMessage = localMessage;
        this.message      = message;
        this.stat       = HttpStatus.BAD_REQUEST;
    }

}

