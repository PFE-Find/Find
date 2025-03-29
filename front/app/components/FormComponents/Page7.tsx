"use client";

import { useState, useEffect } from "react";
import Compressor from "compressorjs";
import "../../globals.css";

export default function Example({ data, updateFields }) {
  const [imageURLs, setImageURLs] = useState<string[]>([]);

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
    }
  }, [imageURLs]);

  async function handleUpdatePhotos(files: FileList) {
    const selectedFiles = Array.from(files);

    const compressAndSave = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6, // Compress image to 60% quality
          maxWidth: 800, // Limit max width to 800px
          maxHeight: 800, // Limit max height to 800px
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
      const compressedImages = await Promise.all(selectedFiles.map(compressAndSave));
      const updatedImages = [...imageURLs, ...compressedImages];
      setImageURLs(updatedImages);
      updateFields({ ...data, photos: updatedImages });
    } catch (error) {
      console.error("Error processing images:", error);
    }
  }

  function handleRemovePhoto(index: number) {
    const updatedImages = imageURLs.filter((_, i) => i !== index);
    setImageURLs(updatedImages);
    updateFields({ ...data, photos: updatedImages });
  }

  return (
    <div className="flex flex-col bg-white overflow-y-auto h-[660px]">
      <div className="flex-1 flex-col place-content-center container mx-auto ">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Ajoutez des photos de votre bien
        </h2>
        <h2 className="text-md text-center mb-10 w-70">
        Vous pouvez ajouter un minimum de 5 photos.
        </h2>

        <div className="flex items-center justify-center w-[700px] container mx-auto">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, ou GIF</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => e.target.files && handleUpdatePhotos(e.target.files)}
              className="hidden"
            />
          </label>
        </div>

        {imageURLs.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {imageURLs.map((image, index) => (
              <div
                key={index}
                className="relative w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden"
              >
                <img src={image} alt={`Uploaded ${index + 1}`} className="object-cover w-full h-full" />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-700"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
