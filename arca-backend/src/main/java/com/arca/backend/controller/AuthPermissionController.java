package com.arca.backend.controller;

import com.arca.backend.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthPermissionController {

    @Autowired
    private PermissionService permissionService;

    /**
     * Retorna as permissões do usuário logado
     */
    @GetMapping("/permissions")
    public Map<String, Object> getUserPermissions(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Map.of("error", "Usuário não autenticado");
        }

        String username = authentication.getName();
        Set<String> apiPermissions = permissionService.getUserApiPermissions(username);
        Set<String> clientPermissions = permissionService.getUserClientPermissions(username);

        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("apiPermissions", apiPermissions);
        response.put("clientPermissions", clientPermissions);
        
        // Debug info
        System.out.println("=== DEBUG PERMISSIONS ===");
        System.out.println("Username: " + username);
        System.out.println("API Permissions: " + apiPermissions);
        System.out.println("Client Permissions: " + clientPermissions);
        System.out.println("========================");

        return response;
    }
}
