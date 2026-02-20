package com.arca.backend.service;

import com.arca.backend.model.Permission;
import com.arca.backend.model.Role;
import com.arca.backend.model.User;
import com.arca.backend.repository.PermissionRepository;
import com.arca.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    public void deleteById(Long id) {
        permissionRepository.deleteById(id);
    }

    /**
     * Retorna todas as URLs da API que o usuário tem permissão de acessar
     */
    public Set<String> getUserApiPermissions(String username) {
        User user = userRepository.findByContactEmail(username).orElse(null);
        if (user == null) {
            return new HashSet<>();
        }

        Set<String> apiUrls = new HashSet<>();
        for (Role role : user.getRoles()) {
            for (Permission permission : role.getPermissions()) {
                if (permission.getUrlApi() != null && !permission.getUrlApi().isEmpty()) {
                    // Split por vírgula para suportar múltiplas URLs
                    String[] urls = permission.getUrlApi().split(",");
                    for (String url : urls) {
                        apiUrls.add(url.trim());
                    }
                }
            }
        }
        return apiUrls;
    }

    /**
     * Retorna todas as URLs do cliente que o usuário tem permissão de acessar
     */
    public Set<String> getUserClientPermissions(String username) {
        User user = userRepository.findByContactEmail(username).orElse(null);
        if (user == null) {
            return new HashSet<>();
        }

        Set<String> clientUrls = new HashSet<>();
        for (Role role : user.getRoles()) {
            for (Permission permission : role.getPermissions()) {
                if (permission.getUrlClient() != null && !permission.getUrlClient().isEmpty()) {
                    // Split por vírgula para suportar múltiplas URLs
                    String[] urls = permission.getUrlClient().split(",");
                    for (String url : urls) {
                        clientUrls.add(url.trim());
                    }
                }
            }
        }
        return clientUrls;
    }

    /**
     * Verifica se o usuário tem permissão para acessar uma URL da API
     */
    @Transactional(readOnly = true)
    public boolean hasApiPermission(String username, String requestUri) {
        Set<String> permissions = getUserApiPermissions(username);
        
        System.out.println("=== HAS_API_PERMISSION DEBUG ===");
        System.out.println("Username: " + username);
        System.out.println("Request URI: " + requestUri);
        System.out.println("User Permissions: " + permissions);
        
        // Verifica correspondência exata ou com padrão wildcard
        for (String permissionUrl : permissions) {
            if (matchesUrl(permissionUrl, requestUri)) {
                System.out.println("MATCHED with pattern: " + permissionUrl);
                System.out.println("================================");
                return true;
            }
        }
        System.out.println("NO MATCH FOUND");
        System.out.println("================================");
        return false;
    }

    /**
     * Verifica se uma URL requisitada corresponde a um padrão de permissão
     * Suporta wildcards com ** para qualquer caminho
     */
    private boolean matchesUrl(String pattern, String url) {
        // Correspondência exata
        if (pattern.equals(url)) {
            return true;
        }

        // Padrão com wildcard no final (ex: /api/users/**)
        if (pattern.endsWith("/**")) {
            String basePattern = pattern.substring(0, pattern.length() - 3);
            return url.startsWith(basePattern);
        }

        // Padrão com wildcard no meio (ex: /api/*/documents)
        if (pattern.contains("*")) {
            String regexPattern = pattern
                .replace("**", ".*")
                .replace("*", "[^/]*");
            return url.matches(regexPattern);
        }

        return false;
    }
}
