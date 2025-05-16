'use client';
import { motion } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Footer() {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const socialLinks = [
    { icon: <FiFacebook className="w-5 h-5" />, name: "Facebook" },
    { icon: <FiTwitter className="w-5 h-5" />, name: "Twitter" },
    { icon: <FiInstagram className="w-5 h-5" />, name: "Instagram" },
    { icon: <FiLinkedin className="w-5 h-5" />, name: "LinkedIn" },
    { icon: <FiYoutube className="w-5 h-5" />, name: "YouTube" }
  ];

  const contactInfo = [
    { icon: <FiMapPin className="w-5 h-5" />, text: "Tunis, Tunisia" },
    { icon: <FiPhone className="w-5 h-5" />, text: "+216 12 345 678" },
    { icon: <FiMail className="w-5 h-5" />, text: "contact@find-agri.com" }
  ];

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={footerVariants}
      className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 py-8 sm:py-12">
          {/* Logo and About - Full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center mb-4 sm:mb-6"
            >
              <img 
                src="/assets/logo.png" 
                alt="Find Agri Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="ml-3 text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">Find</span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              La plateforme leader pour trouver des terrains ou materiel agricoles en Tunisie.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Navigation</h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Accueil', 'Explorer', 'Comment ça marche', 'Témoignages'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href="#" 
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Location terrain', 'Vente terrain', 'Conseils agricoles', 'Analyses sol'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href="#" 
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact - Full width on small mobile */}
          <div className="col-span-1 sm:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Contact</h3>
            <ul className="space-y-3 sm:space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-teal-600 dark:text-teal-400 mr-3 mt-0.5">
                    {info.icon}
                  </span>
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Stacked on mobile */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Find Agri. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {['Conditions', 'Politique de confidentialité', 'Mentions légales'].map((item, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}