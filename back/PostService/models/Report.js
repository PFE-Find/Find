import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    path: { type: String, required: true },
    reportId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    reason: {
        type: DataTypes.ENUM(
            'spam',
            'offensive content',
            'misinformation',
            'harassment',
            'inappropriate language', 
            'other'
        ),
        required : true 
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'resolved'),
        default: 'pending '
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;