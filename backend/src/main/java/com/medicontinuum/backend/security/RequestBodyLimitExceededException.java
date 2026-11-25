package com.medicontinuum.backend.security;

import java.io.IOException;

public final class RequestBodyLimitExceededException extends IOException {
    public RequestBodyLimitExceededException() {
        super("API request body exceeds the configured maximum size");
    }
}
