import Post from './Post.js';
import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  etat: { type: Number }
});

const Material = Post.discriminator('Material', materialSchema);
export default Material;
