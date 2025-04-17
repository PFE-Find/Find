import axios from "axios";
import { Report } from "../models/Report";
import { User } from "../models/User";
import { log } from "console";

const API_URL = "http://127.0.0.1:3001/api/auth";

const userService = {
  // Fetch all reports
  async getReports() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  async findUserByEmail( email :  string)
  {
    try{
      const response =  await axios.post(`${API_URL}/findUserByEmail/`, email);
      return response; 
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async SignUp(eventData: User) {
    try {
      const response = await axios.post(`${API_URL}/`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error adding report:", error);
      throw error;
    }
  },


  // Update an report
  async updateReport(id: string, eventData: Report) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error fetchreport:", error);
      throw error;
    }
  },
  async getUserById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetch user:", error);
      throw error;
    }
  },
  async getUsers() {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

}

export default userService;
