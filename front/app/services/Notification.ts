import axios from "axios";

import { API_URL } from "./URLService";

const Notification = {
    async getNotifications(id: string) {
        try {
          const response = await axios.get(`${API_URL}/Notification/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching Notifications:", error);
          throw error;
        }
      },

      

      async getUnreadCount(id: string) {
        try {
          const response = await axios.get(`${API_URL}/Notification/count/${id}`);
          return response.data.count;
        } catch (error) {
          console.error("Error unread notifications count:", error);
          throw error;
        }
      },

      }

      
export default Notification;