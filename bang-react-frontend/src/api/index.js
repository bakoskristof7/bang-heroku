import axios from "axios";

const url = 'http://localhost:8000/api/users';

export const fetchUsers = () => axios.get(url);