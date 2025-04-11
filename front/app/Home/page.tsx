'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/globals.css";
import Nav from "@/app/components/Nav"
import Footer from "@/app/components/Footer";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Offres from "@/app/components/Home/OffreSection";

export default function Home() {
    const googleMapsApiKey = 'AIzaSyBwuWweetgIP1ZiyM-ttW0a6ARGdrkvij8';
    const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed/v1/place?q=Bizerte,+Tunisie&key=' + googleMapsApiKey); // Default map URL


    return (
        <div>
            <Nav></Nav>
            {/* <section className="bg-white  " style={{ borderRadius: '15px', width: '100%', display: 'flex', flexDirection: 'column', justifySelf: 'center' }}>
                <div className="bg-gradient-to-b from-teal-600 to-teal-200 mx-auto max-w-screen-full text-center lg:py-16 lg:px-11 mb-20 "
                    style={{
                        
                        borderRadius: '15px',
                        width: '90%'
                    }}> */}
            <section className="bg-white  " style={{ borderRadius: '15px', width: '100%', display: 'flex', flexDirection: 'column', justifySelf: 'center' }}>
                <div className="mx-auto bg-gradient-to-b from-[#f0fdf4] to-teal-600 max-w-screen-full text-center lg:py-16 lg:px-11 mb-20"
                    style={{
                        
                        borderRadius: '15px',
                        width: '90%'
                    }}>
                    <h1 className="mb-4 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-4xl lg:text-6xl dark:text-gray-900">
                        Facilitons ensemble <br />
                        le commerce  <span className="text-teal-600">Agricole</span>

                    </h1>

                    <p className="mb-8 text-lg font-normal text-gray-800 lg:text-2xl sm:px-16 xl:px-80 dark:text-gray-700">
                        Finder propose une plateforme intelligente pour faciliter l'achat et <br /> la vente de terres agricoles. En combinant transparence du marché
                    </p>
                    <div className="flex mt-5 flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 ">
                        <Link href="/" className="dark:hover:bg-gray-700 "
                            style={{ borderRadius: '8px' }}>
                            <span className="inline-flex justify-center items-center py-3 px-5 text-base hover:text-teal-800 font-medium text-center text-white rounded-lg bg-teal-700 hover:bg-teal-200 focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-900">
                                Essayez
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </Link>
                        <Link href="/">
                            <span className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-teal-800 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-100  text-green-700 border-gray-700  focus:ring-gray-800">
                                <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                Register
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="mx-auto max-w-screen-2xl sm:py-4 lg:px-6 mb-10">
  <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0 gap-0">

    {/* Opportunités */}
    <div>
      <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-teal-100 lg:h-12 lg:w-12 dark:bg-teal-100">
        <svg className="w-5 h-5 text-teal-700 lg:w-6 lg:h-6 dark:text-teal-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25M8.25 9V5.25M3 11.25v-3a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v3M12 14.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold dark:text-white">Trouvez les meilleures opportunités</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Explorez notre sélection de terres agricoles et d'équipements de haute qualité, mis à jour régulièrement pour vous offrir les meilleures opportunités d'investissement.
      </p>
    </div>

    {/* Transaction sécurisée */}
    <div>
      <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-teal-100 lg:h-12 lg:w-12 dark:bg-teal-300">
        <svg className="w-5 h-5 text-teal-700 lg:w-6 lg:h-6 dark:text-teal-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zM12 14.25c-4.97 0-9 2.239-9 5v1.5h18v-1.5c0-2.761-4.03-5-9-5z" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold dark:text-white">Transaction sécurisée</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Nous garantissons des transactions sécurisées et transparentes, avec des fournisseurs vérifiés et un processus de paiement fiable.
      </p>
    </div>

    {/* Gestion simplifiée */}
    <div>
      <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-teal-100 lg:h-12 lg:w-12 dark:bg-teal-300">
        <svg className="w-5 h-5 text-teal-600 lg:w-6 lg:h-6 dark:text-teal-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4l3 10h4l3-10h4" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold dark:text-white">Gestion simplifiée</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Nous vous proposons une plateforme tout-en-un pour gérer vos investissements agricoles : recherche, évaluation, négociation, paiement et suivi des transactions.
      </p>
    </div>

    {/* Accompagnement personnalisé */}
    <div>
      <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-teal-100 lg:h-12 lg:w-12 dark:bg-teal-300">
        <svg className="w-5 h-5 text-teal-600 lg:w-6 lg:h-6 dark:text-teal-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7H7v6h6V7zM17 7h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4 0H7a2 2 0 01-2-2V7a2 2 0 012-2h6" />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold dark:text-white">Accompagnement personnalisé</h3>
      <p className="text-gray-500 dark:text-gray-400">
        Bénéficiez d'un accompagnement dédié et d'analyses IA pour vous aider à prendre des décisions éclairées et maximiser vos investissements agricoles.
      </p>
    </div>

  </div>
</div>




                <div className=" mx-auto max-w-screen-xl md:grid md:grid-cols-2 m-20">

                    <img
                        className="object-cover h-[450px] w-[550px] mr-0  shadow-xl  dark:bg-gray-800"
                        src="/assets/home_1.jpeg"
                        alt="dashboard image"

                    />
                    <div className="mt-4 ">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-green-600">
                            dans toutes les régions agricoles de la Tunisie.
                        </h2>
                        <p className="mb-3 mt-5  font-light text-gray-500 md:text-lg dark:text-gray-400">
                            Find  propose une plateforme intelligente pour faciliter l'achat et la vente de terres agricoles. En combinant transparence du marché et analyses basées sur l'IA, nous permettons aux agriculteurs, investisseurs et vendeurs de prendre des décisions éclairées et de maximiser leurs opportunités.                        </p>
                        <Link
                            href="#"
                            className="inline-flex mt-5 items-center text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-teal-900"
                        >
                            Get started
                            <svg
                                className="ml-2  w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
                <Offres></Offres>






                <h2 className="text-3xl font-bold text-center m-20">
                    Avec <span className="text-teal-700">Find</span>, achetez et vendez en toute simplicité
                </h2>
                <div className="flex flex-wrap justify-center gap-32 mb-20">


                    <div className="max-w-sm bg-white rounded-3xl shadow-sm dark:bg-gray-800 dark:border-gray-700 text-center">
                        <a href="#">
                            <img className="object-cover w-full h-[450px] rounded-t-3xl" src="/assets/home1.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Publiez votre annonce en quelques clics</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Ajoutez facilement une annonce avec une description détaillée, des photos et un prix. Que ce soit pour un terrain agricole, un terrain résidentiel ou du matériel agricole, mettez en avant vos offres en quelques minutes.</p>
                        </div>
                    </div>

                    <div className="max-w-sm bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 text-center">
                        <a href="#">
                            <img className="object-cover w-full h-[450px] rounded-t-3xl" src="/assets/home2.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Trouvez rapidement des acheteurs ou des vendeurs près de chez vous</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Grâce à notre système de recherche avancé, filtrez les annonces selon vos critères : emplacement, superficie, type de terrain ou équipement disponible. Trouvez exactement ce dont vous avez besoin sans perdre de temps.</p>
                        </div>
                    </div>

                    <div className="max-w-sm bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 text-center">
                        <a href="#">
                            <img className="object-cover w-full h-[450px] rounded-t-3xl" src="/assets/home4.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Discutez directement avec les intéressés</h5>
                            </a>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Entrez en contact avec les vendeurs ou acheteurs via notre messagerie intégrée. Posez vos questions, négociez les prix et obtenez toutes les informations nécessaires avant de conclure la transaction.</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 container mx-auto rounded-2xl mb-20">
                    <div style={{ width: "100%" }}>
                        <iframe
                            width="100%"
                            height="500"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=tunisia+(My%20Business%20Name)&amp;t=p&amp;z=6&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        ></iframe>
                    </div>
                </div>

                <Footer></Footer>

            </section>

        </div>
    );
}
