import axios from "axios";



import { API_URL } from "./URLService";

const Message = {
    async getMessages() {
        try {
          const response = await axios.get(`${API_URL}/Message/getall`);
          return response.data;
        } catch (error) {
          console.error("Error fetching messages:", error);
          throw error;
        }
      },
      async getUsersConversations(userId: string) {
        try {

          const response = await axios.get(`${API_URL}/Message/getUsersConversations/${userId}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching Users:", error);
          throw error;
        }
      },
      async sendMessage(message: any) {
        console.log("message",message);
        try {
          const response = await axios.post(`${API_URL}/Message/`, message);
          return response.data;
        } catch (error) {
          console.error("Error adding message:", error);
          throw error;
        }
      },
      async getConversation(user1Id: string,user2Id: string) {
        try {

          const response = await axios.get(`${API_URL}/Message/getConversation/${user1Id}/${user2Id}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching Conversation:", error);
          throw error;
        }
      },
      async deleteMessage(id: string) {
        try {

          const response = await axios.delete(`${API_URL}/Message/deleteMessage/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error delete message:", error);
          throw error;
        }
      },
      async updateMessage(id: string, text: string) {
        try {
            const response = await axios.put(`${API_URL}/Message/updateMessage/${id}`, { text });
            return response.data;
        } catch (error) {
            console.error("Error update message:", error);
            throw error;
        }
    },
}
export default Message;