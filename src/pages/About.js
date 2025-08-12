import React from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, Award, Lightbulb } from 'lucide-react';

const About = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
        Sobre IQ geoSpatial Technology
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Somos una startup apasionada por la innovación geoespacial, dedicada a transformar el mundo a través de la tecnología.
      </p>

      <div className="space-y-16">
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="md:w-1/2 text-center md:text-left">
            <div className="p-4 bg-blue-100 rounded-full inline-block mb-4">
              <Rocket className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra Misión</h2>
            <p className="text-lg text-gray-700">
              Somos IQ GeoSpatial Technology Labs, una startup dedicada a la innovación geoespacial. Diseñamos soluciones inteligentes que transforman datos territoriales en tecnología aplicable a escala local y global.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="/assets/mision.png" alt="Misión" className="rounded-lg shadow-md" />
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row-reverse items-center gap-8"
        >
          <div className="md:w-1/2 text-center md:text-left">
            <div className="p-4 bg-purple-100 rounded-full inline-block mb-4">
              <Lightbulb className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra Visión</h2>
            <p className="text-lg text-gray-700">
              Ser un referente global en innovación geoespacial, desarrollando tecnologías que transformen la gestión territorial, impulsen decisiones inteligentes y conecten comunidades con soluciones sostenibles y escalables.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="/assets/vision.png" alt="Visión" className="rounded-lg shadow-md" />
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center"
        >
          <div className="p-4 bg-green-100 rounded-full inline-block mb-4">
            <Users className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Equipo</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Somos un equipo multidisciplinario de ingenieros, científicos de datos y desarrolladores, unidos por la pasión por la geografía y la tecnología. Nuestra experiencia y creatividad son el motor de cada proyecto.
          </p>
          {/* Aquí podrías añadir fotos y descripciones de los miembros del equipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <img src="/assets/13014933.png" alt="Miembro del equipo" className="w-32 h-32 rounded-full object-cover mb-4 shadow-md" />
              <h4 className="text-xl font-semibold text-gray-800">Cesar Quintana</h4>
              <p className="text-gray-600">CEO & Fundador</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/13014933.png" alt="Miembro del equipo" className="w-32 h-32 rounded-full object-cover mb-4 shadow-md" />
              <h4 className="text-xl font-semibold text-gray-800">Alison Quintana</h4>
              <p className="text-gray-600">CTO</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/assets/13014933.png" alt="Miembro del equipo" className="w-32 h-32 rounded-full object-cover mb-4 shadow-md" />
              <h4 className="text-xl font-semibold text-gray-800">Mia Oxcenford</h4>
              <p className="text-gray-600">Jefe de Desarrollo GIS</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default About;