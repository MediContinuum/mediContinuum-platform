package com.medicontinuum.backend.adherence.dto;

import java.util.List;
import java.util.UUID;

public record ScheduleGenerationResponse(

    UUID prescriptionId,

    int createdCount,

    int alreadyExistingCount,

    int skippedItemCount,

    List<String> skippedItems
) {}