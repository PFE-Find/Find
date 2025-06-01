import axios from "axios";
import { Comment } from "../models/Comment";


import { API_URL } from "./URLService";

const CommentService = {
  // Fetch all comments
  async getComments() {
    try {
      const response = await axios.get(`${API_URL}/Comments/getcomment`);
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Fetch a single event by ID
  async getComment(id: string) {
    try {
      const response = await axios.get(`${API_URL}/Comments/post/${id}`);
      return response.data.Comments || [];;
     
      
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },
  async addComment(eventData: Comment) {
    try {
      const response = await axios.post(`${API_URL}/Comments/`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Delete an report
  async deleteComment(id: string) {
    try {
      const response = await axios.delete(`${API_URL}/Comments/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },



}

export default CommentService;
