package com.pink.itms.exception.task;

public class InvalidTaskDescriptionException extends RuntimeException {
    public InvalidTaskDescriptionException(String message) {
        super(message);
    }
}
