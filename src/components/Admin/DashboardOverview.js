import React from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Settings } from 'lucide-react';

const DashboardOverview = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Resumen del Panel</h2>
      <p className="text-gray-700 text-lg mb-8">
        Bienvenido. Desde aquí puedes gestionar el contenido y los usuarios de tu sitio.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 flex items-center gap-4">
          <Users className="w-10 h-10 text-blue-600" />
          <div>
            <p className="text-gray-600">Total Usuarios</p>
            <p className="text-3xl font-bold text-blue-800">{stats.users}</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-6 flex items-center gap-4">
          <Package className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-gray-600">Software Publicado</p>
            <p className="text-3xl font-bold text-green-800">{stats.software}</p>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 flex items-center gap-4">
          <Settings className="w-10 h-10 text-purple-600" />
          <div>
            <p className="text-gray-600">Servicios Ofrecidos</p>
            <p className="text-3xl font-bold text-purple-800">{stats.services}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;