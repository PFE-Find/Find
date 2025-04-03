import express from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem } from '../controllers/itemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/GetAll', getItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
