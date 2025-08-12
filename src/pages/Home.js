import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence
import { Map, Globe, Code, Lightbulb, Satellite, Layers, TrendingUp } from 'lucide-react';

import { useAuth } from '../hooks/useAuth'; // Importar hook de autenticación
import { supabase } from '../utils/supabaseClient'; // 1. Importar Supabase

const Home = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const { loading: authLoading } = useAuth(); // Obtener el estado de carga de la autenticación
  // 2. Estados para las imágenes del carrusel y la carga
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingCarousel, setLoadingCarousel] = useState(true);

  useEffect(() => {
    // No intentar cargar las imágenes hasta que la sesión de autenticación esté verificada.
    if (authLoading) return;

    // 3. Obtener las imágenes de Supabase solo una vez, cuando el componente se monta.
    const fetchCarouselImages = async () => {
      const { data, error } = await supabase.from('homepage_carousel').select('id, image_url, alt_text');
      if (error) {
        console.error('Error fetching carousel images:', error);
      } else {
        setCarouselImages(data || []);
      }
      setLoadingCarousel(false);
    };

    fetchCarouselImages();
  }, [authLoading]); // Se ejecuta cuando el estado de carga de la autenticación cambia.

  // Este efecto se encarga del intervalo y se reinicia solo si las imágenes cambian.
  useEffect(() => {
    if (carouselImages.length === 0) return; // No hacer nada si no hay imágenes
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000); // Cambia la imagen cada 5 segundos
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      {/* Sección de Cabecera con Imagen de Fondo */}
      <div
        className="relative w-full bg-cover bg-center py-24 md:py-32 rounded-xl shadow-xl overflow-hidden" // Añadido w-full
        style={{ backgroundImage: "url('https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0TB9WNi5OC5NA8gnBVpXH1xYGvSUuPebwsFoR')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div> {/* Overlay para mejor legibilidad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-white px-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Innovación Geoespacial para un Mundo Mejor
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            En IQ geoSpatial Technology, transformamos datos geográficos complejos en soluciones inteligentes y accesibles.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-blue-800 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Descubre Más
          </motion.button>
        </motion.div>
      </div>

      {/* Sección de Características */}
      <div className="py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.div variants={featureVariants} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <Map className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Análisis Avanzado</h3>
            <p className="text-gray-600">Descubre patrones y toma decisiones informadas con nuestros análisis geoespaciales.</p>
          </motion.div>

          <motion.div variants={featureVariants} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <Globe className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Visualización Interactiva</h3>
            <p className="text-gray-600">Explora tus datos en mapas dinámicos y visualizaciones cautivadoras.</p>
          </motion.div>

          <motion.div variants={featureVariants} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-4 bg-purple-100 rounded-full mb-4">
              <Code className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Desarrollo de Software</h3>
            <p className="text-gray-600">Soluciones a medida para tus necesidades específicas de software geoespacial.</p>
          </motion.div>

          <motion.div variants={featureVariants} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-4 bg-orange-100 rounded-full mb-4">
              <Lightbulb className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Consultoría Experta</h3>
            <p className="text-gray-600">Asesoramiento profesional para optimizar tus proyectos geoespaciales.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Sección de Información Adicional (Teledetección, SIG, Geodesia) */}
      <div className="py-16 bg-gray-50 rounded-xl shadow-lg px-8 mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          Explora el Mundo Geoespacial
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Satellite className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Teledetección</h3>
            <p className="text-gray-700">
              La teledetección nos permite observar y medir la Tierra desde el espacio, utilizando sensores en satélites y aeronaves. Capturamos datos sobre la superficie terrestre, la atmósfera y los océanos, revelando información crucial para el monitoreo ambiental, la agricultura de precisión y la gestión de desastres.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <Layers className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Sistemas de Información Geográfica (SIG)</h3>
            <p className="text-gray-700">
              Los SIG son herramientas poderosas para capturar, almacenar, manipular, analizar y presentar todo tipo de datos geográficos. Nos permiten entender patrones espaciales, realizar análisis complejos y crear mapas interactivos para una mejor toma de decisiones en planificación urbana, logística y recursos naturales.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Geodesia</h3>
            <p className="text-gray-700">
              La geodesia es la ciencia que estudia la forma y dimensiones de la Tierra, así como su campo de gravedad y sus variaciones temporales. Es fundamental para establecer sistemas de coordenadas precisos, la navegación global y el monitoreo de fenómenos geodinámicos como el movimiento de las placas tectónicas.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Carrusel de Imágenes */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="relative w-full max-w-5xl mx-auto rounded-xl shadow-xl overflow-hidden mb-16"
        style={{ height: '400px' }} // Altura fija para el carrusel
      >
        {loadingCarousel ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Cargando imágenes...</div>
        ) : (
          <>
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentImageIndex}
                src={carouselImages[currentImageIndex]?.image_url}
                alt={carouselImages[currentImageIndex]?.alt_text}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
              {carouselImages.map((image, idx) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-gray-400/70'}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Home;