import axios from "axios";


const API_URL = "http://127.0.0.1:3001/api/VerificationToken";

const VerificationService = {
  


async verifyEmail(token: string)
{
   try {
      
      const response = await axios.post(`${API_URL}/verif`,{token});
      return response.data;
    } catch (error) {
      console.error("Error verifying Email", error);
      throw error;
    }

},

async getVerificationTokenByEmail(email: string) {
    try {
      
      const response = await axios.post(`${API_URL}/verifToken`,email);
      return response.data;
    } catch (error) {
      console.error("Error fetch verif token:", error);
      throw error;
    }
  },
  async delelteExisitingToken (id: string) {
    try {
      
      const response = await axios.post(`${API_URL}/deleteToken/${id}`,);
      return response.data;
    } catch (error) {
      console.error("Error deleting  verif token:", error);
      throw error;
    }
  },
  async createVerificationToken (id: string) {
    try {
      
      const response = await axios.post(`${API_URL}/deleteToken/${id}`,);
      return response.data;
    } catch (error) {
      console.error("Error deleting  verif token:", error);
      throw error;
    }
  },


}








export default VerificationService;
