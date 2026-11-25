package com.medicontinuum.backend.security;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

/** Counts bytes actually read, including chunked requests without Content-Length. */
public final class LimitedBodyRequestWrapper extends HttpServletRequestWrapper {
    private final long maxBytes;
    private ServletInputStream wrappedInputStream;
    private long bytesRead;

    public LimitedBodyRequestWrapper(HttpServletRequest request, long maxBytes) {
        super(request);
        this.maxBytes = Math.max(1024, maxBytes);
    }

    @Override
    public synchronized ServletInputStream getInputStream() throws IOException {
        if (wrappedInputStream == null) {
            ServletInputStream delegate = super.getInputStream();
            wrappedInputStream = new ServletInputStream() {
                @Override
                public int read() throws IOException {
                    int value = delegate.read();
                    if (value != -1) count(1);
                    return value;
                }

                @Override
                public int read(byte[] bytes, int offset, int length) throws IOException {
                    int count = delegate.read(bytes, offset, length);
                    if (count > 0) LimitedBodyRequestWrapper.this.count(count);
                    return count;
                }

                @Override
                public boolean isFinished() { return delegate.isFinished(); }

                @Override
                public boolean isReady() { return delegate.isReady(); }

                @Override
                public void setReadListener(ReadListener readListener) {
                    delegate.setReadListener(readListener);
                }
            };
        }
        return wrappedInputStream;
    }

    @Override
    public BufferedReader getReader() throws IOException {
        String encoding = getCharacterEncoding();
        return new BufferedReader(new InputStreamReader(
            getInputStream(),
            encoding == null ? StandardCharsets.UTF_8 : java.nio.charset.Charset.forName(encoding)
        ));
    }

    private synchronized void count(long amount) throws RequestBodyLimitExceededException {
        bytesRead += amount;
        if (bytesRead > maxBytes) throw new RequestBodyLimitExceededException();
    }
}
