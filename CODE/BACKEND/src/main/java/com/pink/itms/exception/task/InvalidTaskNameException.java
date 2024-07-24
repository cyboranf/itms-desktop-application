package com.pink.itms.exception.task;

public class InvalidTaskNameException extends RuntimeException {
    public InvalidTaskNameException(String message) {
        super(message);
    }
}
