import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Save, XCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

const UserManagement = ({ initialUsers, onDataChange }) => {
  const [users, setUsers] = useState(initialUsers || []);
  const [editingUser, setEditingUser] = useState(null); // ID del usuario que se está editando
  const [newRole, setNewRole] = useState('');
  const { profile: adminProfile } = useAuth(); // Para no poder eliminarte a ti mismo

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setNewRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewRole('');
  };

  const handleSaveRole = async (userId) => {
    if (!newRole) {
      alert('Por favor, selecciona un rol.');
      return;
    }
    try {
      const { error } = await supabase.rpc('update_user_role', {
        user_id: userId,
        new_role: newRole,
      });

      if (error) throw error;

      alert('¡Rol actualizado con éxito!');
      setEditingUser(null);
      onDataChange(); // Refrescar la lista de usuarios
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userId === adminProfile?.id) {
      alert('No puedes eliminar tu propia cuenta de administrador.');
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmail}? Esta acción es irreversible.`)) {
      try {
        const { error } = await supabase.rpc('delete_user_by_id', { user_id: userId });
        if (error) throw error;

        alert('Usuario eliminado con éxito.');
        onDataChange(); // Refrescar la lista de usuarios
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Email</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Rol</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Registrado el</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-800">{user.email}</td>
                <td className="py-4 px-6">
                  {editingUser === user.id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="superuser">superuser</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' || user.role === 'superuser'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-4 px-6 flex gap-2">
                  {editingUser === user.id ? (
                    <><button onClick={() => handleSaveRole(user.id)} className="text-green-600 hover:text-green-800" title="Guardar"><Save size={20} /></button><button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800" title="Cancelar"><XCircle size={20} /></button></>
                  ) : (
                    <><button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800" title="Editar Rol"><Edit size={20} /></button><button onClick={() => handleDeleteUser(user.id, user.email)} className="text-red-600 hover:text-red-800" title="Eliminar Usuario" disabled={user.id === adminProfile?.id}><Trash2 size={20} /></button></>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UserManagement;
