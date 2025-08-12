import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Cloud, Globe, Satellite, ChevronDown, ChevronUp, Lightbulb, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importar hook de autenticación
import { supabase } from '../utils/supabaseClient';

const Services = () => {
  const [openService, setOpenService] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useAuth(); // Obtener el estado de carga de la autenticación

  useEffect(() => {
    // No intentar cargar los servicios hasta que la sesión de autenticación esté verificada.
    if (authLoading) return;

    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('services_offered').select('*').order('created_at');
      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServiceItems(data || []);
      }
      setLoading(false);
    };
    fetchServices();
  }, [authLoading]); // Se ejecuta cuando el estado de carga de la autenticación cambia.

  const toggleService = (id) => {
    setOpenService(openService === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
        Nuestros Servicios Geoespaciales
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Ofrecemos soluciones innovadoras para transformar tus datos geográficos en información valiosa y accionable.
      </p>

      {loading ? (
        <div className="text-center text-gray-500">Cargando servicios...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src={service.image_url} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                <button
                  className="mt-auto w-full flex items-center justify-center p-3 text-left focus:outline-none text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => toggleService(service.id)}
                >
                  <span>{openService === service.id ? 'Ocultar Detalles' : 'Ver Detalles'}</span>
                  <motion.div
                    initial={false}
                    animate={{ rotate: openService === service.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
              </div>

              <AnimatePresence>
                {openService === service.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="px-6 pb-6 border-t border-gray-200"
                  >
                    <p className="text-gray-700 mt-4 leading-relaxed">
                      <span className="font-semibold">Categoría:</span> {service.category}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ¿Necesitas una solución a medida?
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Si tienes un proyecto específico en mente, nuestro equipo de desarrollo está listo para crear la solución geoespacial que necesitas. ¡Contáctanos!
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Code className="mr-3" /> Solicitar Consultoría
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Services;