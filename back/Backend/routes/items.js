import express from 'express';
import { createItem, getItems3, getItems4 , getItems, getItems1, getItems2, getItemById, updateItem, deleteItem, updateOffreStatus, getLands, getMaterials } from '../controllers/itemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/GetAll', getItems);
router.get('/GetAll1', getItems1);
router.get('/GetAll2', getItems2);
router.get('/GetAll3/:id', getItems3);
router.get('/GetAll4/:id', getItems4);
router.get('/GetLand',getLands); 
router.get('/GetMaterials',getMaterials); 
router.get('/:id', getItemById);
router.put('/updateItem/:id', updateItem);
router.delete('/deleteItem/:id', deleteItem);
router.put('/:id', updateOffreStatus);

export default router;
