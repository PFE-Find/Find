// routes/userRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { FindUserByEmail, SignIn, SignUp } from '../controllers/AuthController.js';
import { getUserById, deleteUser, updateUser, getUsers ,updateUserRole } from "../controllers/UserController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/signup', SignUp);
router.post('/findUserByEmail', FindUserByEmail); 
router.post('/signin', SignIn); 
router.get('/:id', getUserById); 
router.get('/', getUsers); 
router.delete('/deleteUser/:id', deleteUser); 
router.put('/updateUser/:id', upload.single('image'), updateUser);

router.put('/updateUserRole/:id', updateUserRole);

export default router;