package com.arca.backend.dto;

import com.arca.backend.model.Contact;
import com.arca.backend.model.Address;
import java.util.Set;

public class UserCreateDTO {
    private String name;
    private String picture;
    private Contact contact;
    private Address address;
    private String password;
    private Long schoolId;
    private Set<Long> roleIds;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Long getSchoolId() { return schoolId; }
    public void setSchoolId(Long schoolId) { this.schoolId = schoolId; }
    public Set<Long> getRoleIds() { return roleIds; }
    public void setRoleIds(Set<Long> roleIds) { this.roleIds = roleIds; }
}
