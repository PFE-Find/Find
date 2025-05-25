import express from 'express';
import  { CreateComment, GetCommentByUserId, GetComment, GetCommentByPostId ,DeleteComment} from  '../controllers/CommentaireController.js';
var router = express.Router();


router.post('/', CreateComment);
router.get('/getcomment', GetComment);
router.get('/user/:id', GetCommentByUserId);
router.get('/post/:id', GetCommentByPostId); 
router.delete('/delete/:id', DeleteComment); 

export default router;