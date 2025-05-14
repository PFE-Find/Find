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

export const GetCommentByPostId = async (req, res, next) => {
    const offreId = req.params.id;  // No destructuring
  

    try {
        const comments = await Comment.find({ OffreId: offreId });
        

        res.status(200).json({ Comments: comments });  // 200 is more appropriate for GET
    } catch (error) {
        next(error);
    }
};


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

};

export const DeleteComment = async (req, res, next) => {
    const commentId = req.params.id;
    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
};