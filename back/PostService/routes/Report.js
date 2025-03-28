import express from 'express';
import { createReport, updateReport } from '../controllers/ReportController.js';


const router = express.Router();


router.post('/', createReport);
router.put('/:id', updateReport);


export default router;