import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    OffreId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
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
