package com.arca.backend.service;

import com.arca.backend.model.Person;
import com.arca.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    public Person save(Person person) {
        return personRepository.save(person);
    }

    public List<Person> findAll() {
        return personRepository.findAll();
    }

    public boolean deleteById(Long id) {
        return personRepository.existsById(id);
    }
}
