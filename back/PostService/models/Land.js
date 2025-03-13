import Post from './Post.js';
import mongoose from 'mongoose';

const terrainSchema = new mongoose.Schema({
    air: { type: Number, required: true },
    localisation: { type: String, required: true },
    besoins: { type: [String], enum: caracteristics, required: true }  
});


const caracteristics = {
    Eau_potable :'Eau_potable' , 
    Irrigation_system : 'Irrigation_system',
    Electricty:'Électricité',
    Route : 'Accès à la route principale',
    Abri_pour_materiel:'Abri pour matériel'
   
}


const Land = Post.discriminator('Land', terrainSchema);

export default Land;
