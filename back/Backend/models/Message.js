import mongoose from "mongoose";



const ReportSchema = new mongoose.Schema({
    
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

const Report = mongoose.model("Message", ReportSchema);

export default Report;