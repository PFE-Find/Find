import mongoose from 'mongoose';

const VerifToken = new mongoose.Schema({
    email: { 
       type: String, 
        required: true,
    },
    token: {
        type :  String ,  
        required :  true 
    },
    expires:{
        type : Date  
    }}
);

const VerificationToken = mongoose.model('VerificationToken', VerifToken);

export default VerificationToken;
