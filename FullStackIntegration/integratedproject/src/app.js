import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/students",
});

export const getAllStudents = () => API.get("");
export const getStudentById = (id) => API.get(`/${id}`);
export const addStudent = (student) => API.post("", student);
export const deleteStudent = (id) => API.delete(`/${id}`);