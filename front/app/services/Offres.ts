import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/Posts/";

const Offres = {
  // Fetch all offres
  async getOffres() {
    try {
      const response = await axios.get(`${API_URL}GetAll`);
      return response.data;
    } catch (error) {
      console.error("Error fetching offres:", error);
      throw error;
    }
  },

  // Fetch a single offre by ID
  async getOffre(id: string) {
    try {
      const response = await axios.get(`${API_URL}${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching offre:", error);
      throw error;
    }
  },

  // Add a new offre
  async addOffre(offreData: any) {
    try {
      const response = await axios.post(`${API_URL}`, offreData);
      return response.data;
    } catch (error) {
      console.error("Error adding offre:", error);
      throw error;
    }
  },

  // Delete an offre
  async deleteOffre(id: string) {
    try {
      const response = await axios.delete(`${API_URL}Offre/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting offre:", error);
      throw error;
    }
  },

  // Update an offre
  async updateOffre(id: string, offreData: any) {
    try {
      const response = await axios.put(`${API_URL}${id}`, offreData);
      return response.data;
    } catch (error) {
      console.error("Error updating offre:", error);
      throw error;
    }
  },

  // Get total number of offres
  async getTotalOffres() {
    try {
      const response = await axios.get<number>(`${API_URL}totalOffres`);
      return response.data;
    } catch (error) {
      console.error("Error fetching total offres:", error);
      throw error;
    }
  },

  // Search for offres
  async search(searchQuery: string) {
    try {
      const response = await axios.get(`${API_URL}search?search=${searchQuery}`);
      return response.data;
    } catch (error) {
      console.error("Error searching for offres:", error);
      throw error;
    }
  }
};

export default Offres;
