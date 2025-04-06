"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidBar from "../../SideBar";
import Navbar from "../../NavBar";
import eventService from "../../../../services/Offres";
import { useParams } from "next/navigation";
import { Facebook, Twitter, Instagram, MessageCircle, Settings, AppWindow } from "lucide-react";
import Swal from 'sweetalert2';

import {
  FiMapPin,
  FiBox,
  FiImage,
  FiMaximize2,
  FiDollarSign,
  FiInfo,
  FiLayers,
} from "react-icons/fi";
import Maps from "../../../OffreDetails/Maps";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Dialog } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const Details: React.FC = () => {
  const [offre, setOffre] = useState<any>(null);
  const router = useRouter();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchDetails() {
      try {
        if (id) {
          const data = await eventService.getOffre(id as string);
          setOffre(data);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    }
    fetchDetails();
  }, [id]);

  if (!offre) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidBar />
        <main className="flex-1 p-8">
          <Navbar />
          <div className="mt-28 text-center text-gray-500">
            Loading details...
          </div>
        </main>
      </div>
    );
  }

  const openModalAtIndex = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % offre.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + offre.images.length) % offre.images.length);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidBar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Navbar />

        {/* Title Section */}
        <div className="overflow-y-auto h-[734px] mt-24">

          <div className="mb-2 ">
            <div className="flex items-center mb-4">
              <FiInfo className="text-gray-700 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Titre</h2>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 leading-relaxed">
                {offre.titre || "Aucune titre disponible."}
              </p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <FiDollarSign className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Prix</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {offre.prix ? `${offre.prix}` : "N/A"}
                  </p>
                </div>
              </div>

              {offre.propertyType === "Land" && (
                <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="bg-emerald-50 p-3 rounded-full mr-4">
                    <FiMaximize2 className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">Superficie</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {offre.superficie || "N/A"} m²
                    </p>
                  </div>
                </div>
              )}

              {offre.propertyType === "Material" && (
                <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="bg-purple-50 p-3 rounded-full mr-4">
                    <FiLayers className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">État</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(10)].map((_, index) => {
                        const starNumber = index + 1;
                        return starNumber <= offre.etat ? (
                          <AiFillStar key={index} className="text-yellow-500" />
                        ) : (
                          <AiOutlineStar key={index} className="text-gray-300" />
                        );
                      })}
                      <span className="ml-2 text-gray-600 text-sm">({offre.etat} / 10)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <FiInfo className="text-gray-700 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 leading-relaxed">
                {offre.description || "Aucune description disponible."}
              </p>
            </div>
          </div>

          {/* Gallery Section */}
          {offre.images && offre.images.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <FiImage className="text-gray-700 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800">Galerie</h2>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {offre.images.map((image: any, index: number) => {
                    const isLast = index === offre.images.length - 1;

                    return (
                      <div
                        key={index}
                        className="relative aspect-square w-full h-52 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                        onClick={() => isLast && openModalAtIndex(index)}
                      >
                        <Image
                          src={image.path}
                          alt={`Photo ${index + 1}`}
                          fill
                          className="object-cover rounded-xl"
                        />

                        {isLast && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl opacity-60  group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-semibold text-lg">Voir plus</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}


          {/* Modal */}
          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
              <button
                className="absolute top-2 right-2 p-2"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center justify-center">
                <button className="p-2" onClick={prevImage}>
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <img
                  src={offre.images[currentIndex].path}
                  alt="Modal"
                  className="w-full h-[500px] object-cover rounded-md"
                />
                <button className="p-2" onClick={nextImage}>
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          </Dialog>

          {/* Map Section */}
          <div className="mt-4">
            <div className="flex items-center mb-4">
              <FiMapPin className="text-gray-700 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Localisation</h2>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <Maps localisation={offre.localisation} />
            </div>
          </div>
          {/* Content */}
          <div className="mt-28 ">
            {/* Main Profile Container */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gray-800 h-40"></div>

              {/* User Details Section */}
              <div className="relative -mt-16 px-6 pb-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  {/* User Info */}
                  <div className="flex items-center gap-6">
                    <img
                      src="../../"
                      alt="User"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Richard Davis</h2>
                      <p className="text-gray-500">cree en 2020-2-25</p>
                    </div>
                    <div className="flex gap-4 ml-auto">

                      <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                        <MessageCircle className="w-5 h-5 inline-block" /> Message
                      </button>
                      <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                        <Settings className="w-5 h-5 inline-block" /> Settings
                      </button>
                    </div>
                  </div>

                  {/* Section Split */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    {/* Platform Settings */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Platform Settings</h3>
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-500">ACCOUNT</h4>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <label>Email me when someone follows me</label>

                          </div>
                          <div className="flex items-center justify-between">
                            <label>Email me when someone answers on my post</label>

                          </div>
                          <div className="flex items-center justify-between">
                            <label>Email me when someone mentions me</label>

                          </div>
                        </div>



                      </div>
                    </div>

                    {/* Profile Information */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Profile Information</h3>
                      <p className="mt-2 text-gray-500 text-sm">
                        Hi, I'm Alec Thompson. Decisions: If you can't decide, the answer is no. If
                        two equally difficult paths, choose the one more painful in the short term
                        (pain avoidance is creating an illusion of equality).
                      </p>
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-600">First Name:</span>
                          <span>Alec M. Thompson</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-600">Mobile:</span>
                          <span>(44) 123 1234 123</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-600">Email:</span>
                          <span>alecthompson@mail.com</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-600">Location:</span>
                          <span>USA</span>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <a href="#" className="text-blue-500">
                            <Facebook />
                          </a>
                          <a href="#" className="text-blue-400">
                            <Twitter />
                          </a>
                          <a href="#" className="text-pink-500">
                            <Instagram />
                          </a>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className=" bg-opacity-80 rounded-xl  fixed w-[14%] top-10  right-[500px]">
            <div className="flex justify-end ">

              <button
                onClick={async () => {
                  try {
                    await eventService.updateStatut(id as string);
                    Swal.fire({
                      title: 'Offre acceptée !',
                      text: 'La mise à jour a été effectuée avec succès.',
                      icon: 'success',
                      confirmButtonText: 'OK'
                    });
                    router.push("/Admin/OffresPage"); // Navigate to another page after success, change if needed
                  } catch (error) {
                    console.error("Error updating statut:", error);
                    Swal.fire({
                      title: 'Erreur lors de l\'acceptation',
                      text: 'Une erreur est survenue lors de la mise à jour.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                    });
                  }
                }}
                className="relative inline-flex items-center gap-2 px-6 py-3 font-semibold text-teal-50 bg-gradient-to-tr from-teal-700/30 via-teal-700/70 to-teal-700/30 ring-4 ring-teal-700/20 rounded-full overflow-hidden hover:opacity-90 transition-opacity before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-teal-50/10 before:blur-xl mr-3"
              >
                Accepter
              </button>

              <button
                className="relative inline-flex items-center gap-2 px-6 py-3 font-semibold text-red-50 bg-gradient-to-tr from-red-900/30 via-red-900/70 to-red-900/30 ring-4 ring-red-900/20 rounded-full overflow-hidden hover:opacity-90 transition-opacity before:absolute before:top-4 before:left-1/2 before:-translate-x-1/2 before:w-[100px] before:h-[100px] before:rounded-full before:bg-gradient-to-b before:from-red-50/10 before:blur-xl"
              >
                Refuser
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Details;