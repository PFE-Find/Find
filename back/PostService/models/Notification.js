import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false ,
    }
},{ timestamps: true, discriminatorKey: 'propertyType' });

const Notification = mongoose.model('Notification', commentSchema);

export default Notification;
