import express from 'express';
import { createReport, deleteReport, getReports, updateReport } from '../controllers/ReportController.js';


const router = express.Router();


router.post('/', createReport);
router.put('/:id', updateReport);
router.get('/',getReports); 
router.delete('/:id',deleteReport); 
export default router;