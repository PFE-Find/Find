import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post'
    },
    userId: { 
        type: String, 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
