package com.arca.backend.dto;

import com.arca.backend.dto.ContactDTO;
import com.arca.backend.dto.AddressDTO;
import com.arca.backend.dto.PersonDTO;

public class SchoolCreateDTO {
    private String name;
    private ContactDTO contact;
    private AddressDTO address;
    private PersonDTO principal;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ContactDTO getContact() { return contact; }
    public void setContact(ContactDTO contact) { this.contact = contact; }
    public AddressDTO getAddress() { return address; }
    public void setAddress(AddressDTO address) { this.address = address; }
    public PersonDTO getPrincipal() { return principal; }
    public void setPrincipal(PersonDTO principal) { this.principal = principal; }
}
