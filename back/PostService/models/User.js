import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },

    password:{
        type : String  , 
        required : false 

    },
    image: {
        type: String,
        default: null
    },
    role: {
        type: Number,
        default: 0
    },
    emailVerified: {
        type: Date,
        default: null,
    },
},

    { timestamps: true, discriminatorKey: 'propertyType' }
);

const User = mongoose.model('User', UserSchema);

export default User;
