package com.arca.backend.service;

import com.arca.backend.model.Address;
import com.arca.backend.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public Address save(Address address) {
        return addressRepository.save(address);
    }

    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    public boolean deleteById(Long id) {
        return addressRepository.existsById(id);
    }
}
