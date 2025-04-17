"use client";

import { useState, useEffect } from "react";
import Compressor from "compressorjs";
import { X, UploadCloud, Image as ImageIcon, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../globals.css";

export default function ImageUploader({ data, updateFields }) {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem("uploadedPhotos");
    if (savedImages) {
      setImageURLs(JSON.parse(savedImages));
    }
  }, []);

  // Save images to localStorage whenever imageURLs change
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpdatePhotos(e.dataTransfer.files);
    }
  };

  async function handleUpdatePhotos(files: FileList) {
    const selectedFiles = Array.from(files);
    
    // Check if adding these files would exceed 10 images
    if (imageURLs.length + selectedFiles.length > 10) {
      setError("Vous ne pouvez pas télécharger plus de 10 photos");
      setTimeout(() => setError(null), 5000);
      return;
    }

    const compressAndSave = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        new Compressor(file, {
          quality: 0.7,
          maxWidth: 1200,
          maxHeight: 1200,
          convertSize: 1000000, // Convert to JPEG if over 1MB
          success(compressedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
          },
          error(err) {
            reject(err);
          },
        });
      });
    };

    try {
      setError(null);
      const compressedImages = await Promise.all(selectedFiles.map(compressAndSave));
      const updatedImages = [...imageURLs, ...compressedImages];
      setImageURLs(updatedImages);
    } catch (error) {
      console.error("Error processing images:", error);
      setError("Une erreur est survenue lors du traitement des images");
    }
  }

  function handleRemovePhoto(index: number) {
    const updatedImages = imageURLs.filter((_, i) => i !== index);
    setImageURLs(updatedImages);
  }

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