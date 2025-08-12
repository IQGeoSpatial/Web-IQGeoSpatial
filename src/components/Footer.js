import React from 'react';
import { motion } from 'framer-motion';
import { Map, Mail, Phone, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import TikTokIcon from './icons/TikTokIcon'; // Importar el nuevo icono
import WhatsAppIcon from './icons/WhatsAppIcon'; // Importar el icono de WhatsApp

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/16sHytUGPq/' },
    { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/iqgeospatial?igsh=MTBxbmhzbHY4dXF1aw==' },
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/channel/UCoUSMTRIKwvX1mIT8Tfz2eA' },
    { name: 'TikTok', icon: TikTokIcon, url: 'https://tiktok.com/@iq.geospatial' },
    { name: 'WhatsApp', icon: WhatsAppIcon, url: 'https://wa.me/51900102921' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/tu-usuario' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/tu-usuario' },
    { name: 'Email', icon: Mail, url: 'mailto:info@iqgeospatial.com' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="bg-gray-900 text-gray-300 py-12 mt-16"
    >
      <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Columna 1: Logo y Descripción */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <Link to="/" className="font-bold text-white flex items-center gap-2 mb-4">
            <img src='/assets/logo.png' alt='IQ GeoSpatial Logo' className="h-14 w-auto" />
            <span className="hidden sm:block">IQ GeoSpatial Technology</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Transformando el mundo con soluciones geoespaciales innovadoras y tecnología de vanguardia.
          </p>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Navegación</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400 transition-colors duration-300">Inicio</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition-colors duration-300">Servicios</Link></li>
            <li><Link to="/software" className="hover:text-blue-400 transition-colors duration-300">Software</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors duration-300">Nosotros</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors duration-300">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-blue-400" />
              <span>info@iqgeospatial.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-blue-400" />
              <span>(+51) 900 102 921</span>
            </li>
            <li className="flex items-start gap-2">
              <Map size={18} className="text-blue-400 mt-1" />
              <span>Psje. Los claveles, La Merced, Perú</span>
            </li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales y Newsletter (opcional) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
          <div className="flex space-x-4 mb-6">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <social.icon size={24} />
              </a>
            ))}
          </div>
          {/* <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
          <form className="flex">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="p-2 rounded-l-md bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md text-sm transition-colors duration-300">
              Suscribir
            </button>
          </form> */}
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} IQ geoSpatial Technology. Todos los derechos reservados.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;