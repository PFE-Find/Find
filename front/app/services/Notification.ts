import axios from "axios";

const API_URL = "http://127.0.0.1:3001/api/Notification/";

const Notification = {
    async getNotifications(id: string) {
        try {
          const response = await axios.get(`${API_URL}${id}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching Notifications:", error);
          throw error;
        }
      },

      

      async getUnreadCount(id: string) {
        try {
          const response = await axios.get(`${API_URL}count/${id}`);
          return response.data.count;
        } catch (error) {
          console.error("Error unread notifications count:", error);
          throw error;
        }
      },

      }

      
export default Notification;