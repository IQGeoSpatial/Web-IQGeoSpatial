import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient'; // Importar el cliente de Supabase

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. ¡Revisa bien!');
      setLoading(false);
      return;
    }

    try {
      // Un único paso: registrar al usuario y pasar el nombre en los metadatos.
      // La base de datos se encargará de crear el perfil automáticamente.
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Así la base de datos puede leer el nombre.
          },
        },
      });

      if (error) throw error;

      // Redirigir al login después del registro, pasando un mensaje de éxito.
      navigate('/login', { state: { message: '¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta.' } });
    } catch (error) {
      console.error('Error detallado al registrar:', error);
      if (error.message.includes('duplicate key value violates unique constraint')) {
        setError('Este correo electrónico ya está registrado. Por favor, intenta con otro.');
      } else if (error.message.includes('check constraint')) {
        setError('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error inesperado durante el registro. Revisa la consola para más detalles.');
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
          <div className="p-4 bg-green-100 rounded-full inline-block mb-4">
            <UserPlus className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Registrarse</h1>
          <p className="text-gray-600">Crea tu cuenta en IQ geoSpatial Technology</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">¡Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>
          </div>
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>
          <motion.button
            type="submit"
            className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : <><UserPlus className="mr-3" /> Registrarse</>}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Register;