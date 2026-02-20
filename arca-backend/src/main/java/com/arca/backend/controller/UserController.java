package com.arca.backend.controller;

import com.arca.backend.dto.UserCreateDTO;
import com.arca.backend.model.Address;
import com.arca.backend.model.Contact;
import com.arca.backend.model.Role;
import com.arca.backend.model.School;
import com.arca.backend.model.User;
import com.arca.backend.service.AddressService;
import com.arca.backend.service.ContactService;
import com.arca.backend.service.RoleService;
import com.arca.backend.service.UserService;
import com.arca.backend.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private ContactService contactService;
    @Autowired
    private AddressService addressService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public User createUser(@RequestBody UserCreateDTO dto) {
        // Salva contato
        Contact contact = contactService.save(dto.getContact());
        // Salva endereço
        Address address = addressService.save(dto.getAddress());

        // Cria usuário
        User user = new User();
        user.setName(dto.getName());
        user.setPicture(dto.getPicture());
        user.setContact(contact);
        user.setAddress(address);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword())); // Criptografa a senha
        user.setActive(true);

        // Define a escola se fornecida
        if (dto.getSchoolId() != null) {
            School school = schoolRepository.findById(dto.getSchoolId()).orElse(null);
            user.setSchool(school);
        }

        // Adiciona roles se vierem
        if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
            Set<Role> roles = new java.util.HashSet<>();
            for (Long roleId : dto.getRoleIds()) {
                roleService.findAll().stream()
                    .filter(r -> r.getId().equals(roleId))
                    .findFirst()
                    .ifPresent(roles::add);
            }
            user.setRoles(roles);
        }

        return userService.save(user);
    }

    @PutMapping("/{id}")
    @PatchMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserCreateDTO dto) {
        // Busca o usuário existente
        User existingUser = userService.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza nome e picture
        existingUser.setName(dto.getName());
        existingUser.setPicture(dto.getPicture());

        // Atualiza senha apenas se foi fornecida
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            existingUser.setPasswordHash(passwordEncoder.encode(dto.getPassword())); // Criptografa a senha
        }

        // Atualiza contato
        if (dto.getContact() != null) {
            Contact contact = existingUser.getContact();
            contact.setPhone(dto.getContact().getPhone());
            contact.setPhone2(dto.getContact().getPhone2());
            contact.setEmail(dto.getContact().getEmail());
            contactService.save(contact);
        }

        // Atualiza endereço
        if (dto.getAddress() != null) {
            Address address = existingUser.getAddress();
            address.setStreet(dto.getAddress().getStreet());
            address.setNumber(dto.getAddress().getNumber());
            address.setCity(dto.getAddress().getCity());
            address.setState(dto.getAddress().getState());
            address.setZip(dto.getAddress().getZip());
            addressService.save(address);
        }

        // Atualiza escola
        if (dto.getSchoolId() != null) {
            School school = schoolRepository.findById(dto.getSchoolId()).orElse(null);
            existingUser.setSchool(school);
        } else {
            existingUser.setSchool(null);
        }

        // Atualiza roles
        if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
            Set<Role> roles = new java.util.HashSet<>();
            for (Long roleId : dto.getRoleIds()) {
                roleService.findAll().stream()
                    .filter(r -> r.getId().equals(roleId))
                    .findFirst()
                    .ifPresent(roles::add);
            }
            existingUser.setRoles(roles);
        }

        return userService.save(existingUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }

    @GetMapping("/schools")
    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }
}
