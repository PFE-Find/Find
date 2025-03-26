var express = require('express');
const { CreateComment, GetCommentByUserId, GetCommentByPostId } = require('../controllers/CommentaireController');
var router = express.Router();


router.post('/', CreateComment);
router.get('/user/:id', GetCommentByUserId);
router.get('/post/:id', GetCommentByPostId); 