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
  // Fetch all offres with statue true
  async getOffres1() {
    try {
      const response = await axios.get(`${API_URL}GetAll1`);
      return response.data;
    } catch (error) {
      console.error("Error fetching offres:", error);
      throw error;
    }
  },
  // Fetch all offres with statue false
  async getOffres2() {
    try {
      const response = await axios.get(`${API_URL}GetAll2`);
      return response.data;
    } catch (error) {
      console.error("Error fetching offres:", error);
      throw error;
    }
  },

  async getLands() {
    try {
      const response = await axios.get(`${API_URL}GetLand`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Lands:", error);
      throw error;
    }
  },
  async getMaterials() {
    try {
      const response = await axios.get(`${API_URL}GetMaterials`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Materials:", error);
      throw error;
    }
  },


  async getAllOffresByUserId(id: string) {
    
      
      
      const response = await axios.get(`${API_URL}GetAll3/${id}`);
      return response.data;
   
      
     
  },
  async getAllOffresByUserId2(id: string) {
    
   
      const response = await axios.get(`${API_URL}GetAll4/${id}`);
      return response.data;
    
  },

  // Fetch a single offre by ID
  async getOffre(id: string) {
    
      const response = await axios.get(`${API_URL}${id}`);
      return response.data;
    
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
      const response = await axios.delete(`${API_URL}deleteItem/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting offre:", error);
      throw error;
    }
  },

  // Update an offre
  async updateOffre(id: string, offreData: any) {
    try {
      const response = await axios.put(`${API_URL}updateItem/${id}`, offreData);
      return response.data;
    } catch (error) {
      console.error("Error updating offre:", error);
      throw error;
    }
  },
  updateStatut: async (id: string) => {
    const response = await axios.put(`${API_URL}${id}`);
    console.log(response.data);
    
    return response.data;
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
