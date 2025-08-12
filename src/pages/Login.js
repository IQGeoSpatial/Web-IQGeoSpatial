import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient'; // Importar el cliente de Supabase

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Estado para el mensaje de éxito
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
     if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el estado para que el mensaje no reaparezca si se navega de nuevo a login
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password } = formData;

    try {
      // 1. Iniciar sesión
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener el perfil del usuario para saber su rol
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      // Si hay un error al obtener el perfil (muy raro), lo enviamos a la página principal como fallback.
      if (profileError) {
        // Este es un caso crítico: el usuario existe en auth, pero no en profiles.
        // Puede ocurrir si se borra el perfil manualmente.
        // Lo mejor es cerrar la sesión para evitar un estado inconsistente.
        console.error("Error crítico: Perfil no encontrado para un usuario autenticado.", profileError);
        setError('Tu cuenta de autenticación existe, pero tu perfil de usuario no. Esto puede ocurrir si el perfil fue eliminado. Por favor, contacta al soporte o intenta registrarte de nuevo.');
        
        // Cerramos la sesión del usuario para que no quede en un estado "roto".
        await supabase.auth.signOut();

        // No redirigimos, el usuario se queda en la página de login para ver el error.
        return; 
      }

      // 3. Redirigir según el rol del usuario.
      if (profileData.role === 'admin' || profileData.role === 'superuser') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error detallado al iniciar sesión:', error);
      if (error.message.includes('Email not confirmed')) {
        setError('Tu cuenta aún no ha sido confirmada. Por favor, revisa tu correo electrónico.');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Correo o contraseña incorrectos. Por favor, verifica tus datos.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex items-center justify-center min-h-[calc(100vh-150px)] py-12"
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="p-4 bg-blue-100 rounded-full inline-block mb-4">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Accede a tu cuenta de IQ geoSpatial Technology</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">¡Éxito!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">¡Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="tu.correo@example.com"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : <><LogIn className="mr-3" /> Iniciar Sesión</>}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;