import express from 'express';
import  { CreateComment, GetCommentByUserId, GetCommentByPostId } from  '../controllers/CommentaireController.js';
var router = express.Router();


router.post('/', CreateComment);
router.get('/user/:id', GetCommentByUserId);
router.get('/post/:id', GetCommentByPostId); 

export default router;