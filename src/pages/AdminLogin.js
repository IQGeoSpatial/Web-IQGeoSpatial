import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const { email, password } = formData;

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error("Error crítico: Perfil no encontrado para un usuario autenticado.", profileError);
        setError('Tu cuenta de autenticación existe, pero tu perfil de usuario no. Por favor, contacta al soporte.');
        await supabase.auth.signOut();
        return;
      }

      if (profileData.role === 'admin' || profileData.role === 'superuser') {
        navigate('/admin');
      } else {
        setError('No tienes los permisos necesarios para acceder a esta área.');
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error detallado al iniciar sesión de admin:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
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
      className="flex items-center justify-center min-h-[calc(100vh-150px)] py-12 bg-gray-50"
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 md:p-12 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="p-4 bg-purple-100 rounded-full inline-block mb-4">
            <Shield className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Acceso de Administrador</h1>
          <p className="text-gray-600">Ingresa tus credenciales para acceder al panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">¡Acceso Denegado!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" placeholder="admin@example.com" disabled={loading} />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300" placeholder="••••••••" disabled={loading} />
            </div>
          </div>
          <motion.button type="submit" className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? 'Verificando...' : <><Shield className="mr-3" /> Entrar al Panel</>}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;