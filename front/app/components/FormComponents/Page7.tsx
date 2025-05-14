"use client";

import { useState, useEffect } from "react";
import Compressor from "compressorjs";
import { X, UploadCloud, Image as ImageIcon, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as nsfwjs from "nsfwjs"; // named import per docs :contentReference[oaicite:9]{index=9}
import "../../globals.css";

export default function ImageUploader({ data, updateFields }) {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<nsfwjs.NSFWJS | null>(null);

  // 1. Load NSFWJS model once :contentReference[oaicite:10]{index=10}
  useEffect(() => {
    nsfwjs.load().then(setModel);
  }, []);

  // 2. Load/save images to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("uploadedPhotos");
    if (saved) setImageURLs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (imageURLs.length > 0) {
      localStorage.setItem("uploadedPhotos", JSON.stringify(imageURLs));
      updateFields({ ...data, photos: imageURLs });
    }
  }, [imageURLs, data, updateFields]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

 

  const checkImageProfanity = async (base64: string): Promise<boolean> => {
    if (!model) return false;
    const img = new Image();
    img.src = base64;
    await new Promise((res) => { img.onload = res; }); 
    const preds = await model.classify(img,1);
    console.log(preds);
    return preds.some(p => p.className != "Neutral");
  };

  // 4. Handle new uploads synchronously
  const handleUpdatePhotos = async (files: FileList) => {
    const selected = Array.from(files);
    if (imageURLs.length + selected.length > 10) {
      setError("Vous ne pouvez pas télécharger plus de 10 photos");
      return void setTimeout(() => setError(null), 5000);
    }

    try {
      setError(null);
      // Compress all files
      const compressed: string[] = await Promise.all(
        selected.map(f => new Promise<string>((res, rej) => {
          new Compressor(f, {
            quality: 0.7, maxWidth: 1200, maxHeight: 1200, convertSize: 1e6,
            success(file) {
              const reader = new FileReader();
              reader.onloadend = () => res(reader.result as string);
              reader.onerror = rej;
              reader.readAsDataURL(file);
            },
            error: rej,
          });
        }))
      );

      // 5. Check each for NSFW :contentReference[oaicite:14]{index=14}
      /*for (let b64 of compressed) {
        if (await checkImageProfanity(b64)) {
          alert("⚠️ Contenu inapproprié détecté.");
          return;
        }
      }*/
      // 6. Safe: append and update state
      setImageURLs(prev => [...prev, ...compressed]);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du traitement des images");
    }
  };

  // 7. Drag & drop / remove handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleUpdatePhotos(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (idx: number) =>
    setImageURLs(u => u.filter((_, i) => i !== idx));


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="flex flex-col bg-white  p-6 overflow-y-auto h-[700px]"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Ajoutez des photos de votre bien
          </h1>
          <p className="text-lg text-gray-600">
            {imageURLs.length > 0 
              ? `Vous avez ajouté ${imageURLs.length} photo(s) (minimum 5 recommandé)`
              : "Téléchargez entre 5 et 10 photos de qualité"}
          </p>
        </div>

        <div 
          className={`relative rounded-2xl border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} transition-all duration-200 mb-8`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-64 cursor-pointer p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`p-4 mb-4 rounded-full ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} transition-colors`}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="mb-2 text-lg font-medium text-gray-700">
                {isDragging ? "Déposez vos photos ici" : "Glissez-déposez vos photos ou cliquez pour sélectionner"}
              </p>
              <p className="text-sm text-gray-500">
                Formats supportés: JPG, PNG (max 5MB par photo)
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {imageURLs.length}/10 photos téléchargées
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => e.target.files && handleUpdatePhotos(e.target.files)}
              className="hidden"
            />
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {imageURLs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageURLs.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md group"
              >
                <img 
                  src={image} 
                  alt={`Uploaded ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Photo principale
                  </span>
                )}
              </motion.div>
            ))}
            
            {imageURLs.length < 10 && (
              <motion.label
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">Ajouter plus</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => e.target.files && handleUpdatePhotos(e.target.files)}
                  className="hidden"
                />
              </motion.label>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">
              Aucune photo téléchargée
            </h3>
            <p className="text-gray-400 mt-1">
              Ajoutez des photos pour donner vie à votre annonce
            </p>
          </div>
        )}

        {imageURLs.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Conseil :</span> La première photo sera utilisée comme image principale de votre annonce.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}