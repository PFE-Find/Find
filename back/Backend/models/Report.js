import mongoose from "mongoose";


const Reasons = {
    "spam": "spam",
    "offensive content": "offensive content",
    "misinformation": "misinformation",
    "harassment": "harassment",
    "inappropriate language": "inappropriate language",
    "other": "other"
}
const Status = {
    "pending" :  "pending" , 
    "reviewed": "reviewed",
    "approved" :  "approved"
}

const ReportSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    reason: {
        type: [String], 
        enum: Reasons,
        required: true
    },
    status: {
        type:[String],
        enum:Status,
        default: "pending"
    },
   
    date: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model("Report", ReportSchema);

export default Report;