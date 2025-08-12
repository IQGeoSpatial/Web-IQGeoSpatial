import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence
import { MessageSquare, Facebook, Instagram, X, Bot, User } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon'; // Importar el nuevo icono
import WhatsAppIcon from './icons/WhatsAppIcon'; // Importar el icono de WhatsApp
import ReactMarkdown from 'react-markdown'; // Importar la librería para renderizar Markdown
import { supabase } from '../utils/supabaseClient';

const FloatingButtons = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Estado para manejar el historial de la conversación
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de IQ GeoSpatial. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isBotReplying, setIsBotReplying] = useState(false);
  const chatContainerRef = useRef(null);

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

  // Efecto para desplazar el chat hacia abajo con cada nuevo mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isBotReplying) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsBotReplying(true);

    try {
      const functionName = 'chat';
      // Llama a la función Edge de Supabase
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { messages: newMessages },
        // ¡Esta es la corrección clave! Forzamos el uso de la 'anon key' para la autorización.
        // Las Edge Functions por defecto requieren esto, no el token de un usuario logueado.
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });

      if (error) throw new Error(error.message); // Captura errores de red o del servidor
      if (data.error) throw new Error(data.error); // Captura errores lógicos devueltos por la función

      const botMessage = { role: 'assistant', content: data.reply };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error(`Error al invocar la función 'chat':`, error);
      
      // Damos un mensaje más útil al usuario dependiendo del error
      let displayError = 'Lo siento, ocurrió un error inesperado. Por favor, intenta más tarde.';
      if (error.message.includes('Failed to fetch')) {
        displayError = 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
      } else if (error.message) {
        // Si el error viene de nuestra función, mostramos un mensaje más específico.
        displayError = `Error del asistente: ${error.message}`;
      }
      const errorMessage = { 
        role: 'assistant', 
        content: displayError
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsBotReplying(false);
    }
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
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && <div className="p-2 bg-gray-200 rounded-full"><Bot size={16} className="text-gray-600" /></div>}
                  <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'assistant' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}`}>
                    <div className="prose prose-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  {msg.role === 'user' && <div className="p-2 bg-gray-200 rounded-full"><User size={16} className="text-gray-600" /></div>}
                </div>
              ))}
              {isBotReplying && (
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-gray-200 rounded-full"><Bot size={16} className="text-gray-600" /></div>
                  <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isBotReplying}
                className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isBotReplying ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </form>
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