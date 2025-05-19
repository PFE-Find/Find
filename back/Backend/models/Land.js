import Post from './Post.js';
import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  air: { type: Number },
  Superficie: { type: Number },
  unit:{  type: String, required: true  },
  equipements: { 
    type: [String], 
    
  }
});

const Land = Post.discriminator('Land', landSchema);
export default Land;
