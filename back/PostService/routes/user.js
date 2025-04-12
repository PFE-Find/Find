import express from 'express';
import { FindUserByEmail, SignIn, SignUp } from '../controllers/AuthController.js';

const router = express.Router();


router.post('/signup/',SignUp);
router.post('/findUserByEmail',FindUserByEmail); 
router.post('/signin/',SignIn); 
export default router;