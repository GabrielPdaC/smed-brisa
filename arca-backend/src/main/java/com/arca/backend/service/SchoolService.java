package com.arca.backend.service;

import com.arca.backend.model.School;
import com.arca.backend.model.Contact;
import com.arca.backend.model.Address;
import com.arca.backend.model.Person;
import com.arca.backend.dto.SchoolDTO;
import com.arca.backend.dto.SchoolCreateDTO;
import com.arca.backend.dto.SchoolUpdateDTO;
import com.arca.backend.dto.ContactDTO;
import com.arca.backend.dto.AddressDTO;
import com.arca.backend.dto.PersonDTO;
import com.arca.backend.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SchoolService {
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private ContactService contactService;
    
    @Autowired
    private AddressService addressService;
    
    @Autowired
    private PersonService personService;

    public SchoolDTO save(SchoolCreateDTO schoolCreateDTO) {
        // Criar ou salvar contato
        Contact contact = convertToContact(schoolCreateDTO.getContact());
        contact = contactService.save(contact);
        
        // Criar ou salvar endereço
        Address address = convertToAddress(schoolCreateDTO.getAddress());
        address = addressService.save(address);
        
        // Criar ou salvar diretor
        Person principal = convertToPerson(schoolCreateDTO.getPrincipal());
        principal = personService.save(principal);
        
        // Criar escola
        School school = new School();
        school.setName(schoolCreateDTO.getName());
        school.setContact(contact);
        school.setAddress(address);
        school.setPrincipal(principal);
        
        School savedSchool = schoolRepository.save(school);
        return convertToDTO(savedSchool);
    }

    public SchoolDTO update(Long id, SchoolUpdateDTO schoolUpdateDTO) {
        Optional<School> existingSchool = schoolRepository.findById(id);
        if (existingSchool.isEmpty()) {
            throw new RuntimeException("School not found with id: " + id);
        }
        
        School school = existingSchool.get();
        
        // Atualizar nome
        school.setName(schoolUpdateDTO.getName());
        
        // Atualizar contato
        Contact contact = school.getContact();
        updateContact(contact, schoolUpdateDTO.getContact());
        contactService.save(contact);
        
        // Atualizar endereço
        Address address = school.getAddress();
        updateAddress(address, schoolUpdateDTO.getAddress());
        addressService.save(address);
        
        // Atualizar diretor
        Person principal = school.getPrincipal();
        updatePerson(principal, schoolUpdateDTO.getPrincipal());
        personService.save(principal);
        
        School updatedSchool = schoolRepository.save(school);
        return convertToDTO(updatedSchool);
    }

    public List<SchoolDTO> findAll() {
        return schoolRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public SchoolDTO findById(Long id) {
        Optional<School> school = schoolRepository.findById(id);
        if (school.isEmpty()) {
            throw new RuntimeException("School not found with id: " + id);
        }
        return convertToDTO(school.get());
    }

    public boolean deleteById(Long id) {
        if (schoolRepository.existsById(id)) {
            schoolRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long count() {
        return schoolRepository.count();
    }

    // Métodos de conversão
    private SchoolDTO convertToDTO(School school) {
        SchoolDTO dto = new SchoolDTO();
        dto.setId(school.getId());
        dto.setName(school.getName());
        dto.setContact(convertToContactDTO(school.getContact()));
        dto.setAddress(convertToAddressDTO(school.getAddress()));
        dto.setPrincipal(convertToPersonDTO(school.getPrincipal()));
        dto.setCreatedAt(school.getCreatedAt());
        return dto;
    }

    private ContactDTO convertToContactDTO(Contact contact) {
        ContactDTO dto = new ContactDTO();
        dto.setPhone(contact.getPhone());
        dto.setPhone2(contact.getPhone2());
        dto.setEmail(contact.getEmail());
        return dto;
    }

    private AddressDTO convertToAddressDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setNumber(address.getNumber());
        dto.setZip(address.getZip());
        return dto;
    }

    private PersonDTO convertToPersonDTO(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setName(person.getName());
        dto.setContact(convertToContactDTO(person.getContact()));
        dto.setAddress(convertToAddressDTO(person.getAddress()));
        return dto;
    }

    private Contact convertToContact(ContactDTO contactDTO) {
        Contact contact = new Contact();
        contact.setPhone(contactDTO.getPhone());
        contact.setPhone2(contactDTO.getPhone2());
        contact.setEmail(contactDTO.getEmail());
        return contact;
    }

    private Address convertToAddress(AddressDTO addressDTO) {
        Address address = new Address();
        address.setStreet(addressDTO.getStreet());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setNumber(addressDTO.getNumber());
        address.setZip(addressDTO.getZip());
        return address;
    }

    private Person convertToPerson(PersonDTO personDTO) {
        Person person = new Person();
        person.setName(personDTO.getName());
        
        Contact contact = convertToContact(personDTO.getContact());
        contact = contactService.save(contact);
        person.setContact(contact);
        
        Address address = convertToAddress(personDTO.getAddress());
        address = addressService.save(address);
        person.setAddress(address);
        
        return person;
    }

    private void updateContact(Contact contact, ContactDTO contactDTO) {
        contact.setPhone(contactDTO.getPhone());
        contact.setPhone2(contactDTO.getPhone2());
        contact.setEmail(contactDTO.getEmail());
    }

    private void updateAddress(Address address, AddressDTO addressDTO) {
        address.setStreet(addressDTO.getStreet());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setNumber(addressDTO.getNumber());
        address.setZip(addressDTO.getZip());
    }

    private void updatePerson(Person person, PersonDTO personDTO) {
        person.setName(personDTO.getName());
        updateContact(person.getContact(), personDTO.getContact());
        updateAddress(person.getAddress(), personDTO.getAddress());
    }
}