import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Package, Settings, LogOut, FileImage } from 'lucide-react';
import { supabase } from '../utils/supabaseClient'; // Importar el cliente de Supabase
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 1. Importar el hook

// Importar los nuevos componentes de gestión
import DashboardOverview from '../components/Admin/DashboardOverview';
import UserManagement from '../components/Admin/UserManagement';
import SoftwareManagement from '../components/Admin/SoftwareManagement';
import ServiceManagement from '../components/Admin/ServiceManagement';
import SiteContentManagement from '../components/Admin/SiteContentManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]); // Este estado podría moverse al componente UserManagement
  const [softwareProducts, setSoftwareProducts] = useState([]);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { session, profile, loading: authLoading } = useAuth(); // Usar el hook de autenticación

  useEffect(() => {
    // Esta función ahora es más robusta y carga los datos en paralelo.
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);

      // Preparamos todas las consultas para ejecutarlas en paralelo.
      const fetchUsers = supabase.rpc('get_all_users_with_profiles');
      const fetchSoftware = supabase.from('software_products').select('*');
      const fetchServices = supabase.from('services_offered').select('*');

      // Promise.allSettled espera a que todas las promesas terminen, incluso si algunas fallan.
      const results = await Promise.allSettled([fetchUsers, fetchSoftware, fetchServices]);

      const [usersResult, softwareResult, servicesResult] = results;
      let errorMessages = [];

      // Procesamos el resultado de los usuarios.
      if (usersResult.status === 'fulfilled' && !usersResult.value.error) {
        setUsers(usersResult.value.data || []);
      } else {
        const errorMessage = usersResult.status === 'rejected' ? usersResult.reason.message : usersResult.value.error.message;
        console.error('Error fetching users:', errorMessage);
        errorMessages.push(`Usuarios: ${errorMessage}`);
      }

      // Procesamos el resultado del software.
      if (softwareResult.status === 'fulfilled' && !softwareResult.value.error) {
        setSoftwareProducts(softwareResult.value.data || []);
      } else {
        const errorMessage = softwareResult.status === 'rejected' ? softwareResult.reason.message : softwareResult.value.error.message;
        console.error('Error fetching software:', errorMessage);
        errorMessages.push(`Software: ${errorMessage}`);
      }

      // Procesamos el resultado de los servicios.
      if (servicesResult.status === 'fulfilled' && !servicesResult.value.error) {
        setServicesOffered(servicesResult.value.data || []);
      } else {
        const errorMessage = servicesResult.status === 'rejected' ? servicesResult.reason.message : servicesResult.value.error.message;
        console.error('Error fetching services:', errorMessage);
        errorMessages.push(`Servicios: ${errorMessage}`);
      }

      if (errorMessages.length > 0) {
        setError(`No se pudieron cargar todos los datos del panel. Errores: ${errorMessages.join('; ')}`);
      }

      setLoading(false);
    };

    // Lógica de protección y carga de datos simplificada
    if (authLoading) {
      // Si el estado de autenticación aún se está cargando, no hacemos nada y mostramos el spinner.
      return;
    }

    if (profile && (profile.role === 'admin' || profile.role === 'superuser')) {
      // Si el usuario está autenticado y es admin/superuser, cargamos los datos.
      fetchAdminData();
    } else {
      // Si no está autenticado o no tiene el rol correcto, lo redirigimos al login.
      // Esto también gestionará el caso del logout, ya que 'profile' se volverá null.
      navigate('/admin/login');
    }
  }, [profile, authLoading, navigate]);

  const handleLogout = async () => {
    // Lógica de logout directa y robusta: 1. Cerrar sesión, 2. Redirigir.
    const { error } = await supabase.auth.signOut(); 
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      setError('No se pudo cerrar la sesión. Por favor, inténtalo de nuevo.');
    } else {
      // Redirigir explícitamente a la página de login para poder ingresar con otra cuenta.
      // Usamos { replace: true } para que el usuario no pueda volver al panel con el botón "atrás".
      navigate('/admin/login', { replace: true });
    }
  };

  // Usamos useCallback para evitar que esta función se recree en cada render
  const refreshData = useCallback(async (table) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error refreshing ${table}:`, error);
    } else {
      if (table === 'services_offered') setServicesOffered(data);
      if (table === 'software_products') setSoftwareProducts(data);
      // Añadir más casos si es necesario
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    const { data: usersData, error: usersError } = await supabase.rpc('get_all_users_with_profiles');
    if (usersError) {
      setError('No se pudo actualizar la lista de usuarios.');
    } else {
      setUsers(usersData || []);
    }
    setLoading(false);
  }, []);

  const renderContent = () => {
    if (loading || authLoading) return <div className="text-center text-gray-600 text-xl">Cargando datos del panel...</div>;
    if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p className="font-bold">Error</p><p>{error}</p></div>;

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={{ users: users.length, software: softwareProducts.length, services: servicesOffered.length }} />;
      case 'users':
        return <UserManagement initialUsers={users} onDataChange={refreshUsers} />;
      case 'software':
        return <SoftwareManagement initialSoftware={softwareProducts} onDataChange={() => refreshData('software_products')} />;
      case 'services':
        return <ServiceManagement initialServices={servicesOffered} onDataChange={() => refreshData('services_offered')} />;
      case 'content':
        return <SiteContentManagement />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
        Panel de Administración
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Navegación */}
        <motion.div
          className="lg:w-1/4 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-28"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={20} /> Resumen
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users size={20} /> Usuarios
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === 'software' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package size={20} /> Software
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === 'services' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings size={20} /> Servicios
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                activeTab === 'content' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileImage size={20} /> Contenido del Sitio
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors duration-300 mt-6"
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>
          </nav>
        </motion.div>

        {/* Contenido Principal */}
        <div className="lg:w-3/4">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;