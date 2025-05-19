import express from 'express';
import { createVerificationToken, getVerificationTokenByEmail, verifyEmail } from '../controllers/VerificationTokenController.js';





const router = express.Router();

router.post('/verif',verifyEmail); 
export default router ; 