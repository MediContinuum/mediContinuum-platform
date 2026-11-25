package com.medicontinuum.backend.procurement.service;
import java.util.*;
import com.medicontinuum.backend.procurement.dto.*;
public interface ProcurementService{
    ProcurementResponse create(String email,ProcurementRequests.Create request);
    List<ProcurementResponse> list(String email);
    ProcurementResponse get(String email,UUID orderId);
    ProcurementResponse updateStatus(String email,UUID orderId,ProcurementRequests.UpdateStatus request);
    ProcurementResponse receive(String email,UUID orderId,ProcurementRequests.Receive request);
    void cancel(String email,UUID orderId);
}
