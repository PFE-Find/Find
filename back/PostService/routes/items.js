import express from 'express';
import { createItem, getItems, getItems1, getItems2, getItemById, updateItem, deleteItem, updateOffreStatus } from '../controllers/itemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/GetAll', getItems);
router.get('/GetAll1', getItems1);
router.get('/GetAll2', getItems2);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id', updateOffreStatus);

export default router;
