package com.arca.backend.dto;

import com.arca.backend.dto.ContactDTO;
import com.arca.backend.dto.AddressDTO;

public class PersonDTO {
    private String name;
    private ContactDTO contact;
    private AddressDTO address;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ContactDTO getContact() { return contact; }
    public void setContact(ContactDTO contact) { this.contact = contact; }
    public AddressDTO getAddress() { return address; }
    public void setAddress(AddressDTO address) { this.address = address; }
}