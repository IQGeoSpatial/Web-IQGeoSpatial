import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // ¡Aquí está el componente que faltaba!
import { Menu, X, LogIn, UserPlus, LayoutDashboard, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false); // Estado para el menú de servicios
  const navigate = useNavigate();

  const serviceLinks = [
    { name: 'Análisis Espacial', path: '/services#analysis' },
    { name: 'WebGIS', path: '/services#webgis' },
    { name: 'Consultoría', path: '/services#consulting' },
    { name: 'Imágenes Satelitales', path: '/services#satellite' },
  ];

  const { session, profile, loading: authLoading } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión desde la Navbar:', error.message);
      // Opcional: alertar al usuario del error.
      alert('Hubo un error al cerrar la sesión. Revisa la consola.');
    }
    // Siempre redirigir a /login para permitir un nuevo inicio de sesión,
    // usando 'replace' para que el usuario no pueda volver atrás con el botón del navegador.
    navigate('/login', { replace: true });
  };

  // Estado de autenticación dinámico
  const isAuthenticated = session !== null;
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superuser';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
        <Link to="/" className="font-bold text-blue-800 flex items-center gap-2">
          <img src='/assets/logo.png' alt='IQ GeoSpatial Logo' className="h-[58px] w-auto" />
          <span className="hidden sm:block text-xl">IQ GeoSpatial Technology</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
          >
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Menú desplegable de Servicios */}
          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
              Servicios {isServicesOpen ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
            </button>
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20"
                >
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/software"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
          >
            Software
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
          >
            Nosotros
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
          >
            Contacto
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="h-9 w-48 bg-gray-200 rounded-full animate-pulse"></div>
            ) : !isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md"
                >
                  <LogIn size={18} /> Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md"
                >
                  <UserPlus size={18} /> Registrarse
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-300 shadow-md"
                  >
                    <LayoutDashboard size={18} /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-blue-600">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto' },
          closed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="flex flex-col items-center py-4 space-y-4 bg-white/90">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 w-full text-center"
          >
            Inicio
          </Link>
          {/* Menú desplegable de Servicios para móvil */}
          <div className="w-full text-center">
            <button
              className="flex items-center justify-center w-full text-gray-700 hover:text-blue-600 font-medium text-lg py-2"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              Servicios {isServicesOpen ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
            </button>
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 py-2"
                >
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => { setIsServicesOpen(false); setIsOpen(false); }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            to="/software"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 w-full text-center"
          >
            Software
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 w-full text-center"
          >
            Nosotros
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-blue-600 font-medium text-lg py-2 w-full text-center"
          >
            Contacto
          </Link>
          <div className="flex flex-col items-center gap-4 w-full">
            {authLoading ? (
              <div className="h-9 w-48 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
            ) : !isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 w-3/4"
                >
                  <LogIn size={18} /> Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 w-3/4"
                >
                  <UserPlus size={18} /> Registrarse
                </Link>
              </>
            ) : (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-300 w-3/4">
                      <LayoutDashboard size={18} /> Admin
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 w-3/4">
                    <LogOut size={18} /> Cerrar Sesión
                  </button>
                </>
              )
            }
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;