package com.medicontinuum.backend.vendor.service;
import java.util.*;
import com.medicontinuum.backend.vendor.dto.*;
public interface VendorService{
    VendorResponse create(String email,VendorRequests.Create request);
    List<VendorResponse> list(String email);
    VendorResponse get(String email,UUID vendorId);
    VendorResponse update(String email,UUID vendorId,VendorRequests.Update request);
    void deactivate(String email,UUID vendorId);
}
