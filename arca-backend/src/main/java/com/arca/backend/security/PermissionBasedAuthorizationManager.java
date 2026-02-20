package com.arca.backend.security;

import com.arca.backend.service.PermissionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Component
public class PermissionBasedAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private final PermissionService permissionService;

    public PermissionBasedAuthorizationManager(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @Override
    public AuthorizationDecision check(Supplier<Authentication> authentication, RequestAuthorizationContext context) {
        Authentication auth = authentication.get();
        
        // Se não está autenticado, nega acesso
        if (auth == null || !auth.isAuthenticated()) {
            System.out.println("=== AUTHORIZATION DENIED: Not authenticated ===");
            return new AuthorizationDecision(false);
        }

        HttpServletRequest request = context.getRequest();
        String requestUri = request.getRequestURI();
        String username = auth.getName();

        // Verifica se o usuário tem permissão para acessar esta URL
        boolean hasPermission = permissionService.hasApiPermission(username, requestUri);

        // Debug info
        System.out.println("=== AUTHORIZATION CHECK ===");
        System.out.println("Username: " + username);
        System.out.println("Request URI: " + requestUri);
        System.out.println("Has Permission: " + hasPermission);
        System.out.println("==========================");

        return new AuthorizationDecision(hasPermission);
    }
}
