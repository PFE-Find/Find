import axios from "axios";
import { Report } from "../models/Report";

const API_URL = "http://127.0.0.1:3001/api/Reports";

const reportService = {
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

  // Fetch a single event by ID
  async getReport(id: string) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },
  async addReport(eventData: any) {
    try {
      const response = await axios.post(`${API_URL}/`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error adding report:", error);
      throw error;
    }
  },

  // Delete an report
  async deleteReport(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Update an report
  async updateReport(id: string, eventData: Report) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

}

export default reportService;
