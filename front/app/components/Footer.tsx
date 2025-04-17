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
      viewport={{ once: true }}
      variants={footerVariants}
      className="w-full bg-gray-50 border-t border-gray-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center mb-6"
            >
              <img 
                src="/assets/logo.png" 
                alt="Find Agri Logo" 
                className="w-12 h-12"
              />
              <span className="ml-3 text-2xl font-bold text-green-600">Find</span>
            </motion.div>
            <p className="text-gray-600 mb-6">
              La plateforme leader pour trouver et louer des terrains agricoles en Tunisie.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-green-100 hover:text-green-600 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h3>
            <ul className="space-y-3">
              {['Accueil', 'Explorer', 'Comment ça marche', 'Témoignages'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Services</h3>
            <ul className="space-y-3">
              {['Location terrain', 'Vente terrain', 'Conseils agricoles', 'Analyses sol'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-green-600 mr-3 mt-0.5">
                    {info.icon}
                  </span>
                  <span className="text-gray-600">{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Find Agri. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              {['Conditions', 'Politique de confidentialité', 'Mentions légales'].map((item, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-500 hover:text-green-600 transition-colors"
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