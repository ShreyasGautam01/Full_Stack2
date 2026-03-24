package com.AML2A.Rest_Api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AML2A.Rest_Api.model.Student;
import com.AML2A.Rest_Api.repository.StudentRepository;

@Service
public class StudentService {

	@Autowired
    private StudentRepository repository;

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student saveStudent(Student student) {
        return repository.save(student);
    }
    
    @SuppressWarnings("deprecation")
	public Student getStudentById(int id) {
    	return repository.getById(id);
    }
    public Student updateStudent(int id, Student updatedStudent) {
        // First, retrieve the existing entity from the database to ensure it exists
        Student existingStudent = repository.findById(id).orElse(null);
        if (existingStudent != null) {
            // Overwrite the old properties with the new data
            existingStudent.setName(updatedStudent.getName());
            existingStudent.setCourse(updatedStudent.getCourse());
            return repository.save(existingStudent);
        }
        return null;
    }

    public String deleteStudent(int id) {
        repository.deleteById(id);
        return "Student removed with id: " + id;
    }
}