package com.medicontinuum.backend.auth.service;

import com.medicontinuum.backend.auth.dto.AuthResponse;
import com.medicontinuum.backend.auth.dto.OAuth2Identity;

public interface OAuth2LoginService {
    AuthResponse loginOrLink(OAuth2Identity identity);
}
