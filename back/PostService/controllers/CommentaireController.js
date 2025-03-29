import Comment from "../models/Commantaire.js"



export const CreateComment = async (req, res, next) => {
    try {
        const newItem = new Comment(req.body);
        await newItem.save();
        res.status(201).json({ Comment: newItem });
    }
    catch (error) {
        next(error);
    }
}

export const GetCommentByPostId =  async (req,res,next)  => {

    const {post_Id} = req.params;   
    try{
        const comments = await Comment.find({postId : post_Id}); 
        res.status(201).json({Comments : comments}); 
    }
    catch(error)
    {
        next(error); 
    }

}

export const GetCommentByUserId = async (req, res , next) => {

    const {user_id} =  req.params ;  
    try {
        const comments_user = await Comment.find({userId : user_id}); 
        if (!comments_user) {
            return res.status(404).json({ message: 'Comments  not found' });
          }
        res.status(200).json({Comments : comments_user}); 
    }
    catch(error)
    {
        next(error); 
    }

}