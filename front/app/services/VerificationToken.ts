import axios from "axios";


import { API_URL } from "./URLService";

const VerificationService = {
  


async verifyEmail(token: string)
{
   try {
      
      const response = await axios.post(`${API_URL}/VerificationToken/verif`,{token});
      return response.data;
    } catch (error) {
      console.error("Error verifying Email", error);
      throw error;
    }

},

async getVerificationTokenByEmail(email: string) {
    try {
      
      const response = await axios.post(`${API_URL}/VerificationToken/verifToken`,email);
      return response.data;
    } catch (error) {
      console.error("Error fetch verif token:", error);
      throw error;
    }
  },
  async delelteExisitingToken (id: string) {
    try {
      
      const response = await axios.post(`${API_URL}/VerificationToken/deleteToken/${id}`,);
      return response.data;
    } catch (error) {
      console.error("Error deleting  verif token:", error);
      throw error;
    }
  },
  async createVerificationToken (id: string) {
    try {
      
      const response = await axios.post(`${API_URL}/VerificationToken/deleteToken/${id}`,);
      return response.data;
    } catch (error) {
      console.error("Error deleting  verif token:", error);
      throw error;
    }
  },


}








export default VerificationService;
