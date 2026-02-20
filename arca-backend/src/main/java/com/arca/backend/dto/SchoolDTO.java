package com.arca.backend.dto;

import java.time.LocalDateTime;

public class SchoolDTO {
    private Long id;
    private String name;
    private ContactDTO contact;
    private AddressDTO address;
    private PersonDTO principal;
    private LocalDateTime createdAt;

    public SchoolDTO() {}

    public SchoolDTO(Long id, String name, ContactDTO contact, AddressDTO address, PersonDTO principal, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.address = address;
        this.principal = principal;
        this.createdAt = createdAt;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }

    public ContactDTO getContact() { 
        return contact; 
    }
    
    public void setContact(ContactDTO contact) { 
        this.contact = contact; 
    }

    public AddressDTO getAddress() { 
        return address; 
    }
    
    public void setAddress(AddressDTO address) { 
        this.address = address; 
    }

    public PersonDTO getPrincipal() { 
        return principal; 
    }
    
    public void setPrincipal(PersonDTO principal) { 
        this.principal = principal; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
}