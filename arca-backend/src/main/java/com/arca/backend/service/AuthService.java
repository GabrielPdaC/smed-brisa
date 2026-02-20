package com.arca.backend.service;

import com.arca.backend.dto.AuthResponse;
import com.arca.backend.dto.LoginRequest;
import com.arca.backend.dto.RegisterRequest;
import com.arca.backend.model.*;
import com.arca.backend.repository.*;
import com.arca.backend.security.CustomUserDetails;
import com.arca.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ContactRepository contactRepository;
    private final AddressRepository addressRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ContactRepository contactRepository,
            AddressRepository addressRepository,
            SchoolRepository schoolRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.contactRepository = contactRepository;
        this.addressRepository = addressRepository;
        this.schoolRepository = schoolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Verifica se o email já existe
        if (userRepository.existsByContactEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }

        // Cria o contato
        Contact contact = new Contact();
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setPhone2(request.getPhone2() != null ? request.getPhone2() : "");
        contact = contactRepository.save(contact);

        // Cria o endereço
        Address address = new Address();
        address.setStreet(request.getStreet() != null ? request.getStreet() : "");
        address.setCity(request.getCity() != null ? request.getCity() : "");
        address.setState(request.getState() != null ? request.getState() : "");
        address.setNumber(request.getNumber() != null ? request.getNumber() : "");
        address.setZip(request.getZip() != null ? request.getZip() : "");
        address = addressRepository.save(address);

        // Cria o usuário
        User user = new User();
        user.setName(request.getName());
        user.setPicture(request.getPicture() != null ? request.getPicture() : "");
        user.setContact(contact);
        user.setAddress(address);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);

        // Define a escola se fornecida
        if (request.getSchoolId() != null) {
            School school = schoolRepository.findById(request.getSchoolId()).orElse(null);
            user.setSchool(school);
        }

        // Atribui role padrão (SCHOOL)
        Set<Role> roles = new HashSet<>();
        roleRepository.findByName("SCHOOL").ifPresent(roles::add);
        user.setRoles(roles);

        user = userRepository.save(user);

        // Gera o token
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(userDetails.getUser(), token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        Long schoolId = user.getSchool() != null ? user.getSchool().getId() : null;

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getContact().getEmail(),
                user.getPicture(),
                roles,
                schoolId
        );
    }
}
