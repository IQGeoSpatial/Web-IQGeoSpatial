import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Book, PlayCircle, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importar hook de autenticación
import { supabase } from '../utils/supabaseClient';

const Software = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useAuth(); // Obtener el estado de carga de la autenticación

  useEffect(() => {
    // No intentar cargar el software hasta que la sesión de autenticación esté verificada.
    if (authLoading) return;

    const fetchSoftware = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('software_products').select('*').order('created_at');
      if (error) {
        console.error('Error fetching software:', error);
      } else {
        setSoftwareList(data || []);
      }
      setLoading(false);
    };
    fetchSoftware();
  }, [authLoading]); // Se ejecuta cuando el estado de carga de la autenticación cambia.

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
        Nuestro Software Desarrollado
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Descubre nuestras soluciones de software de escritorio diseñadas para potenciar tus proyectos geoespaciales.
      </p>

      {loading ? (
        <div className="text-center text-gray-500">Cargando software...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {softwareList.map((software) => (
            <motion.div key={software.id} variants={cardVariants} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
              <img src={software.image_url || '/placeholder-image.png'} alt={software.name} className="w-full h-56 object-cover bg-gray-200" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{software.name}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{software.description}</p>
                <div className="flex flex-wrap gap-3 justify-center mt-auto">
                  {software.installer_url && (
                    <a
                      href={software.installer_url}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <Download size={20} /> Descargar
                    </a>
                  )}
                  {software.documentation_url && (
                    <a
                      href={software.documentation_url}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                    >
                      <Book size={20} /> Documentación
                    </a>
                  )}
                  {software.video_url && (
                    <a
                      href={software.video_url}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                    >
                      <PlayCircle size={20} /> Tutorial
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
          Si tienes un proyecto específico en mente, nuestro equipo de desarrollo está listo para crear el software geoespacial que necesitas. ¡Contáctanos!
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Code className="mr-3" /> Solicitar Desarrollo
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Software;