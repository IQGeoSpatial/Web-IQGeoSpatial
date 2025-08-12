import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence
import { MessageSquare, Facebook, Instagram, X } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon'; // Importar el nuevo icono
import WhatsAppIcon from './icons/WhatsAppIcon'; // Importar el icono de WhatsApp

const FloatingButtons = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const socialLinks = [
    { name: 'WhatsApp', icon: WhatsAppIcon, color: 'bg-green-500', hoverColor: 'hover:bg-green-600', link: 'https://wa.me/51900102921' },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700', link: 'https://www.facebook.com/share/16sHytUGPq/' },
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600', link: 'https://www.instagram.com/iqgeospatial?igsh=MTBxbmhzbHY4dXF1aw==' },
    { name: 'TikTok', icon: TikTokIcon, color: 'bg-black', hoverColor: 'hover:bg-gray-800', link: 'https://tiktok.com/@iq.geospatial' },
  ];

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Botones Flotantes de Redes Sociales */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          className="flex flex-col space-y-3"
        >
          {socialLinks.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              aria-label={item.name}
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${item.color} ${item.hoverColor}`}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <item.icon size={24} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Chatbot Flotante (Placeholder) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-24 right-6 z-50 bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold">Chat con IQ geoSpatial</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto text-gray-700">
              <p className="mb-2">¡Hola! ¿En qué puedo ayudarte hoy?</p>
              <p className="mb-2">Soy un chatbot de ejemplo. Aquí iría la interfaz real de tu chatbot.</p>
              {/* Aquí irían los mensajes del chat */}
            </div>
            <div className="p-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                Enviar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-xl flex items-center justify-center"
        variants={buttonVariants}
        initial="visible"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <MessageSquare size={28} />
      </motion.button>
    </>
  );
};

export default FloatingButtons;