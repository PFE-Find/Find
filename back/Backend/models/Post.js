import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    localisation: { type: [Number], required: true },
    placeName: { type: String, required: true },
    propertyType: { type: String, enum: ['Land', 'Material'], required: true },
    id_user: { type: String, required: true },
    statut: { type: Boolean, default: false },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }] 
  },
  { timestamps: true, discriminatorKey: 'propertyType' }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
