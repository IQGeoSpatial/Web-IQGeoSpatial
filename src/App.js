import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons'; // Importar FloatingButtons
import Home from './pages/Home';
import Services from './pages/Services';
import Software from './pages/Software';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-8 max-w-7xl flex-grow"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/software" element={<Software />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </motion.main>

      {/* Sección de Contador de Visitas/Interacción - Movida a Home o a una sección específica si no va en todas las páginas */}
      {/* Si quieres que aparezca solo en Home, muévelo dentro de Home.js */}
      {/* Por ahora, lo dejo aquí para que veas el código, pero lo ideal es que no esté en App.js si no es global */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="relative bg-cover bg-center py-16 md:py-24 mt-16 rounded-xl shadow-xl overflow-hidden"
        style={{ backgroundImage: "url('https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc060Ks5IVFtni9pklCcebwvoumN4D1UEQ3aHWZ')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-800/70 to-blue-800/70 animate-pulse-bg"></div> {/* Overlay con animación */}
        <div className="relative z-10 text-white text-center px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            ¡Impactando el Mundo Geoespacial!
          </h2>
          <p className="text-lg md:text-2xl mb-8">
            Nuestros números hablan por sí solos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
            >
              <p className="text-4xl md:text-6xl font-bold text-yellow-300">1.2M+</p>
              <p className="text-lg md:text-xl mt-2">Visitas al Sitio</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
            >
              <p className="text-4xl md:text-6xl font-bold text-green-300">500K+</p>
              <p className="text-lg md:text-xl mt-2">Descargas de Software</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
            >
              <p className="text-4xl md:text-6xl font-bold text-pink-300">100+</p>
              <p className="text-lg md:text-xl mt-2">Proyectos Completados</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
      <FloatingButtons /> {/* Añadir los botones flotantes aquí */}
    </div>
  );
}

export default App;