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
            <section className="bg-white  " style={{ borderRadius: '15px', width: '100%', display: 'flex', flexDirection: 'column', justifySelf: 'center' }}>
                <div className="mx-auto max-w-screen-full text-center lg:py-16 lg:px-11 mb-20"
                    style={{
                        backgroundColor: 'oklch(0.979 0.021 166.113)',
                        borderRadius: '15px',
                        width: '90%'
                    }}>
                    <h1 className="mb-4 text-2xl font-bold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-6xl dark:text-gray-900">
                        Facilitons ensemble <br />
                        le commerce  <span style={{ color: 'oklch(0.596 0.145 163.225)' }}>Agricole</span>

                    </h1>

                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-2xl sm:px-16 xl:px-80 dark:text-gray-700">
                        Finder propose une plateforme intelligente pour faciliter l'achat et <br /> la vente de terres agricoles. En combinant transparence du marché
                    </p>
                    <div className="flex mt-5 flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 ">
                        <Link href="/" className="dark:hover:bg-gray-700 "
                            style={{ borderRadius: '8px' }}>
                            <span className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                Essayez
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </Link>
                        <Link href="/">
                            <span className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-100  text-green-700 border-gray-700  focus:ring-gray-800">
                                <svg className="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                Register
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="mx-auto max-w-screen-2xl  sm:py-4 lg:px-6 mb-10">

                    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0 gap-0">
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-300">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Marketing</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Plan it, create it, launch it. Collaborate seamlessly with all the organization and hit your marketing goals every month with our marketing plan.
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-300">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Legal</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Protect your organization, devices and stay compliant with our structured workflows and custom permissions made for you.
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-300">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Business Automation</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Auto-assign tasks, send Slack messages, and much more. Now power up with hundreds of new templates to help you get started.
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-300">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Finance</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Audit-proof software built for critical financial operations like month-end close and quarterly budgeting.
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
                            className="inline-flex mt-5 items-center text-green bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900"
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
                    Avec <span style={{ color: 'oklch(0.596 0.145 163.225)' }}>Find</span>, achetez et vendez en toute simplicité
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
                <div className="p-4 container mx-auto rounded-2xl">
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
