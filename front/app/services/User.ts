import axios from "axios";
import { Report } from "../models/Report";
import { User } from "../models/User";
import { log } from "console";


import { API_URL } from "./URLService";

const userService = {
  // Fetch all reports
  async getReports() {
    try {
      const response = await axios.get(`${API_URL}/auth/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  async findUserByEmail( email :  string)
  {
    try{
      const response =  await axios.post(`${API_URL}/auth/findUserByEmail/`, email);
      return response; 
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async SignUp(eventData: User) {
    try {
      const response = await axios.post(`${API_URL}/auth/`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error adding report:", error);
      throw error;
    }
  },


  // Update an report
  async updateReport(id: string, eventData: Report) {
    try {
      const response = await axios.put(`${API_URL}/auth/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error fetchreport:", error);
      throw error;
    }
  },

   // Update an password
  async changePassword(id: string, data: { currentPassword?: string, newPassword: string }) {
  try {
    const response = await axios.put(`${API_URL}/auth/changePassword/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error changePassword:", error);
    throw error;
  }
},


async updateUserRole(id: string, role: number) {
  console.log("role",role);
    try {
      const response = await axios.put(`${API_URL}/auth/updateUserRole/${id}`, { role });
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      
      const response = await axios.get(`${API_URL}/auth/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetch user:", error);
      throw error;
    }
  },
  async getUsers() {
    try {
      const response = await axios.get(`${API_URL}/auth`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  async UpadetUser(id: string, formData: FormData) {
    
    
    try {
      const response = await axios.put(`${API_URL}/auth/updateUser/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  async deleteUser(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/auth/deleteUser/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting User:", error);
      throw error;
    }
  },


}

export default userService;
