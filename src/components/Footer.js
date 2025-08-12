import React from 'react';
import { motion } from 'framer-motion';
import { Map, Globe, Mail, Phone, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
          <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2 mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-lg">IQ</span>
            <span className="hidden sm:block">geoSpatial</span>
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
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-start gap-2">
              <Map size={18} className="text-blue-400 mt-1" />
              <span>Av. Siempre Viva 742, Springfield, USA</span>
            </li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales y Newsletter (opcional) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
          <div className="flex space-x-4 mb-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <Globe size={24} /> {/* Icono genérico para otras plataformas */}
            </a>
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
        <p className="mt-2">Diseñado con <span className="text-red-500">&hearts;</span> por tu asistente de IA favorito (o sea, yo).</p>
      </div>
    </motion.footer>
  );
};

export default Footer;