import axios from "axios";

const API_URL = "http://localhost:8880/events/";

const eventService = {
  // Fetch all events
  async getEvents() {
    try {
      const response = await axios.get(`${API_URL}GetAll`);
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Fetch a single event by ID
  async getEvent(id: string) {
    try {
      const response = await axios.get(`${API_URL}Event/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  // Add a new event
  async addEvent(eventData: any) {
    try {
      const response = await axios.post(`${API_URL}EventCreation/`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  },

  // Delete an event
  async deleteEvent(id: string) {
    try {
      const response = await axios.delete(`${API_URL}Event/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Update an event
  async updateEvent(id: string, eventData: any) {
    try {
      const response = await axios.put(`${API_URL}${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Get total number of events
  async getTotalEvents() {
    try {
      const response = await axios.get<number>(`${API_URL}totalEvents`);
      return response.data;
    } catch (error) {
      console.error("Error fetching total events:", error);
      throw error;
    }
  },

  // Search for events
  async search(searchQuery: string) {
    try {
      const response = await axios.get(`${API_URL}search?search=${searchQuery}`);
      return response.data;
    } catch (error) {
      console.error("Error searching for events:", error);
      throw error;
    }
  }
};

export default eventService;
