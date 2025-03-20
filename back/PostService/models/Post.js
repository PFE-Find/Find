import mongoose from 'mongoose';

const category =
{
  Ferme : "Ferme" ,
  Terrain_Agricole:"Terrain_Agricole",
  Materiel_Agricole: "Materiel_Agricole",
  Terrain_Residentiel:"Terrain_Residentiel"
}
const post = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    Category: { type: [String] ,  enum : category, required: true },
  },
  { timestamps: true }
);


const Item = mongoose.model('Post', post);
export default Item;
