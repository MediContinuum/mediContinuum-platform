package com.medicontinuum.backend.auth.service;

import com.medicontinuum.backend.auth.dto.AuthRequests;
import com.medicontinuum.backend.auth.dto.AuthResponse;
import com.medicontinuum.backend.user.dto.UserResponse;

public interface AuthService {
    AuthResponse registerPatient(AuthRequests.Register request);
    AuthResponse login(AuthRequests.Login request);
    AuthResponse refresh(AuthRequests.Refresh request);
    UserResponse me(String email);
    void logout(String email, AuthRequests.Logout request);
    void changePassword(String email, AuthRequests.ChangePassword request);
}
