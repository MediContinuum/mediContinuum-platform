$ErrorActionPreference = "Stop"

$javaRoot = Join-Path $PSScriptRoot "src/main/java/com/medicontinuum/backend"

$features = @(
    "auth", "user", "patient", "family", "organisation", "doctor",
    "medicine", "prescription", "adherence", "inventory", "notification",
    "vendor", "procurement", "appointment", "analytics"
)

foreach ($feature in $features) {
    $className = (Get-Culture).TextInfo.ToTitleCase($feature)
    $featureRoot = Join-Path $javaRoot $feature
    $basePackage = "com.medicontinuum.backend.$feature"

    foreach ($folder in @("controller", "service", "repository", "entity", "dto")) {
        New-Item -ItemType Directory -Force `
            -Path (Join-Path $featureRoot $folder) | Out-Null
    }

    $files = @{
        "controller/${className}Controller.java" = @"
package $basePackage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/$feature")
public class ${className}Controller {
}
"@
        "service/${className}Service.java" = @"
package $basePackage.service;

import org.springframework.stereotype.Service;

@Service
public class ${className}Service {
}
"@
        "repository/${className}Repository.java" = @"
package $basePackage.repository;

import org.springframework.stereotype.Repository;

@Repository
public interface ${className}Repository {
}
"@
        "entity/${className}.java" = @"
package $basePackage.entity;

public class ${className} {
}
"@
        "dto/${className}Dto.java" = @"
package $basePackage.dto;

public class ${className}Dto {
}
"@
    }

    foreach ($relativePath in $files.Keys) {
        $path = Join-Path $featureRoot $relativePath
        if (-not (Test-Path $path)) {
            Set-Content -Path $path -Value $files[$relativePath] -Encoding utf8
        }
    }
}

Write-Host "Created feature packages and starter files under $javaRoot"