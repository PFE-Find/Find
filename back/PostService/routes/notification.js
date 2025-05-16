import express from 'express';
import {  getNotifById ,getUnreadCount } from '../controllers/NotoficationController.js';


const router = express.Router();


router.get('/count/:id', getUnreadCount);
router.get('/:id', getNotifById);


export default router;