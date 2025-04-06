'use client';

import { stat } from "fs";
import { useEffect, useState } from "react";
import { Report } from "@/app/models/Report";
import reportService from "@/app/services/Report";
import { Comment } from "@/app/models/Comment";
import CommentService from "@/app/services/Comment";
import { format } from 'date-fns';
interface Offre {
  offre: {
    location: number[]; // The location is stored as an array [lat, lon]
    createdAt: string;
    prix: number;
  };
}

export default function Detail({ offre }: Offre) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [locationName, setLocationName] = useState('Fetching location...');
  const UserId = 'akram';
  const PostId = '67db85c756ef98d8d00c6b43';

  // const [offre, setOffre] = useState(null);

  console.log("Offre received:", offre);




  enum Status {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
  }
  // Reverse Geocoding to get location name or fallback to village name
  const fetchLocationName = async () => {
    try {
      console.log('Offre location:', offre.location);

      // Ensure the location array is valid
      if (!Array.isArray(offre.location) || offre.location.length !== 2) {
        console.error('Invalid location format:', offre.location);
        setLocationName('Invalid location data');
        return;
      }

      const [lat, lon] = offre.location; // Extract latitude and longitude
      console.log('Latitude:', lat, 'Longitude:', lon);

      // Fetch reverse geocoding data
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Reverse geocoding response:', data);

      // Extract city, village, or fallback to "Unknown location"
      setLocationName(
        data.address?.city || data.address?.village || 'Unknown location'
      );
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Unknown location');
    }
  };

  useEffect(() => {
    fetchLocationName();
  }, [offre]);

  async function submitReport(data: Report) {
    try {
      await reportService.addReport(data);
      alert('Report added successfully!');
    } catch (error) {
      console.error('Error adding report:', error);
    }
  }

  async function submitComment(params: Comment) {
    try {
      await CommentService.addComment(params);
      alert("comment submited succesfully");
    }
    catch (error) {
      console.log("Error Adding your comment! " + error);

    }

  }
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Report submitted:", { reportReason, description });

    const report: Report = {
      text: description,
      userId: UserId,
      postId: PostId,
      reason: reportReason,
      status: Status.Pending,
    };
    console.log(report);
    submitReport(report);


    setReportReason('');
    setDescription('');
    setIsModalOpen(false);
  };
  const handleSubmitComment = (e) => {
    e.preventDefault();
    console.log("comment Added Successfully");
    const comment: Comment =
    {
      userId: UserId,
      postId: PostId,
      text: comments
    }
    console.log(comment);

    submitComment(comment);

    setComments('');
  }
  
  
  


  return (
    <>
      <div className="container mx-auto flex flex-col gap-8 p-6 bg-white rounded-lg shadow-md mb-10">
        {/* Section Utilisateur & Avis */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profil & Avis */}
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <img className="w-20 h-20 rounded-full object-cover" src="/assets/wessim.png" alt="Neil image" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Ahmed Mohsen</h2>
                <p className="text-sm text-gray-500">Le propriétaire du terrain</p>
                <p className="text-sm text-gray-500">Membre depuis 3 ans</p>
              </div>
            </div>

            {/* Avis */}
            <hr className="my-4 border-gray-300" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <img src="https://img.icons8.com/ios/50/000000/star.png" className="w-6 h-6" alt="Star" />
                <div>
                  <p className="font-semibold text-gray-800">
                    Très bien noté par les voyageurs du pays suivant : <span className="text-black">Tunis</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    100 % des voyageurs de ce pays (Tunis) ont donné une évaluation globale de
                    5 étoiles à ce logement au cours de l'année passée.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Infos & Prix */}
          <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg shadow">
            <div className="grid grid-cols-2 text-gray-700">
              <div className="border-b p-2">
                <p className="text-sm font-semibold text-green-600">Date d'ajout</p>
                <p className="text-sm">
                  {format(new Date(offre.createdAt), 'yyyy-MM-dd')}
                </p>
              </div>
              <div className="border-b p-2">
                <p className="text-sm font-semibold text-green-600">Lieu</p>
                <p className="text-sm">{locationName}</p>
              </div>
              <div className="p-2 col-span-2">
                <p className="text-sm font-semibold text-green-600">Prix</p>
                <p className="text-lg font-semibold">{offre.prix} DNT</p>
              </div>
            </div>

            {/* Contact & Signalement */}
            <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
              Contacter le prestataire
            </button>
            <div className="mt-3 text-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                className="text-sm text-gray-500 hover:underline flex items-center justify-center gap-1"
              >
                <span>🚩</span> Signaler cette annonce
              </a>
            </div>
          </div>
        </div>

        {/* Nouvelle Section en dessous */}
        <div className="w-full">
          <hr className="border-gray-300" />
          <p className="mt-4 text-gray-700">
            Menzel Abderrahmane, située sur la rive nord du lac de Bizerte, est une ville qui allie traditions agricoles et développement industriel.
            Historiquement, la région est connue pour ses activités agricoles, notamment l’exploitation de fermes familiales dédiées à la culture de diverses céréales,
            de légumes et à l’élevage. Ces dernières années, la ville a connu une transformation notable avec l’établissement du Technopôle Agroalimentaire de Bizerte
            (AGRO’TECH) sur une superficie de 45 hectares à Menzel Abderrahmane. Ce pôle se concentre sur la recherche, l’innovation, le développement technologique,
            la formation...
          </p>

          {/* Ce que propose ce logement */}
          <hr className="my-4 border-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800">Ce que propose ce logement</h3>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="https://img.icons8.com/ios/50/000000/sprout.png" className="w-6 h-6" alt="Feature Icon" />
              <p className="text-gray-700">Cette terre est adaptée à toutes les saisons.</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="https://img.icons8.com/ios/50/000000/approval.png" className="w-6 h-6" alt="Feature Icon" />
              <p className="text-gray-700">Cette terre est validée par l'État.</p>
            </div>
          </div>
        </div>

      </div>
      {/* comments section   */}
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Discussion (20)
            </h2>
          </div>
          <form className="mb-6" onSubmit={handleSubmitComment}>
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="6"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <button
              type="submit"

              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
            >
              Post comment
            </button>
          </form>
          {[{
            name: "Michael Gough",
            avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
            date: "Feb. 8, 2022",
            text: "Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy."
          }, {
            name: "Jese Leos",
            avatar: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
            date: "Feb. 12, 2022",
            text: "Much appreciated! Glad you liked it ☺️"
          }, {
            name: "Bonnie Green",
            avatar: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
            date: "Mar. 12, 2022",
            text: "The article covers the essentials, challenges, myths and stages the UX designer should consider while creating the design strategy."
          }].map((comment, index) => (
            <article key={index} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                    <img className="mr-2 w-6 h-6 rounded-full" src={comment.avatar} alt={comment.name} />
                    {comment.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time>{comment.date}</time>
                  </p>
                </div>
              </footer>
              <p className="text-gray-500 dark:text-gray-400">{comment.text}</p>
              <div className="flex items-center mt-4 space-x-4">
                <button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                  <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                  </svg>
                  Reply
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Report Modal */}
      {isModalOpen && (
        <div
          id="report-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-sm">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">Signaler l'annonce</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal Body */}
              <form className="p-4" onSubmit={handleSubmit}>
                <fieldset className="mb-4">
                  <legend className="block mb-2 text-sm font-medium text-gray-900">Raison du signalement:</legend>
                  <div className="space-y-2">
                    {[
                      "spam",
                      "offensive content",
                      "misinformation",
                      "harassment",
                      "inappropriate language",
                    ].map((reason) => (
                      <div key={reason} className="flex items-center">
                        <input
                          id={reason}
                          type="radio"
                          name="reportReason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          required
                        />
                        <label htmlFor={reason} className="ml-2 text-sm font-medium text-gray-900 capitalize">
                          {reason}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div className="mb-4">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ajoutez des détails supplémentaires..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Envoyer le signalement
                </button>
              </form>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
