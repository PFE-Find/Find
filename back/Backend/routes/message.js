import express from 'express';
import { createMessage, getConversation, getAllMessages ,getUsersConversations ,deleteMessage ,updateMessage} from '../controllers/messageController.js';


const router = express.Router();


router.post('/', createMessage);
router.get('/getall', getAllMessages);
router.get('/getUsersConversations/:userId', getUsersConversations);
router.get('/getConversation/:user1Id/:user2Id', getConversation);
router.delete('/deleteMessage/:id', deleteMessage);
router.put('/updateMessage/:id', updateMessage);

export default router;