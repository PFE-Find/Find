import mongoose from 'mongoose';

const category =
{
  Ferme : "Ferme" ,
  Terrain_Agricole:"Terrain agricole",
  Materiel_Agricole: "Matériel agricole",
  Terrain_Residentiel:"Terrain résidentiel"
}
const post = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    propertyTypes: { type: [String] ,  enum : category, required: true },
    FavorieStatut:{type : String , default: "false" },
    id_user:  {type : String , default : 1}
  },
  { timestamps: true }
);


const Item = mongoose.model('Post', post);
export default Item;
