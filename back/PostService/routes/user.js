import express from 'express';
import { FindUserByEmail, SignIn, SignUp } from '../controllers/AuthController.js';
import { getUserById, getUsers } from "../controllers/UserController.js"

const router = express.Router();


router.post('/signup/',SignUp);
router.post('/findUserByEmail',FindUserByEmail); 
router.post('/signin/',SignIn); 
router.get('/:id',getUserById); 
router.get('/',getUsers); 
export default router;