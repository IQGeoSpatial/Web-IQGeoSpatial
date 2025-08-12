import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, UploadCloud } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const ServiceManagement = ({ initialServices, onDataChange }) => {
  const [services, setServices] = useState(initialServices || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState({ title: '', description: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentService.title || (!imageFile && !isEditMode)) {
      alert('El título y la imagen son obligatorios.');
      return;
    }
    setIsSubmitting(true);

    try {
      let imageUrl = currentService.image_url; // Mantener la URL existente si se está editando

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `services/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('site-assets') // Nombre de tu bucket
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const serviceData = { ...currentService, image_url: imageUrl };

      const { error: insertError } = isEditMode
        ? await supabase.from('services_offered').update(serviceData).eq('id', currentService.id)
        : await supabase.from('services_offered').insert([serviceData]);

      if (insertError) throw insertError;

      alert(`¡Servicio ${isEditMode ? 'actualizado' : 'añadido'} con éxito!`);
      setIsModalOpen(false);
      setImageFile(null);
      onDataChange(); // Llama a la función para refrescar los datos en el componente padre

    } catch (error) {
      console.error('Error al añadir/actualizar servicio:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId, imageUrl) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.')) {
      try {
        const { error: deleteError } = await supabase
          .from('services_offered')
          .delete()
          .eq('id', serviceId);

        if (deleteError) throw deleteError;

        if (imageUrl) {
          const filePath = new URL(imageUrl).pathname.split('/site-assets/')[1];
          if (filePath) {
            await supabase.storage.from('site-assets').remove([filePath]);
          }
        }

        alert('Servicio eliminado con éxito.');
        onDataChange();

      } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentService({ title: '', description: '', category: '' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setImageFile(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Servicios</h2>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <PlusCircle size={20} /> Añadir Servicio
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Imagen</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Título</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Categoría</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <img src={service.image_url} alt={service.title} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="py-4 px-6 font-medium text-gray-800">{service.title}</td>
                <td className="py-4 px-6 text-gray-600">{service.category}</td>
                <td className="py-4 px-6 flex gap-3 items-center">
                  <button onClick={() => openEditModal(service)} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit size={20} /></button>
                  <button onClick={() => handleDelete(service.id, service.image_url)} className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título del Servicio</label>
                  <input type="text" name="title" id="title" value={currentService.title} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input type="text" name="category" id="category" value={currentService.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea name="description" id="description" rows="4" value={currentService.description} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagen del Servicio</label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Sube un archivo</span>
                          <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                        </label>
                        <p className="pl-1">o arrástralo aquí</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      {imageFile && <p className="text-sm text-green-600 mt-2">{imageFile.name}</p>}
                      {isEditMode && !imageFile && currentService.image_url && <p className="text-sm text-gray-500 mt-2">Imagen actual: <a href={currentService.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">ver imagen</a></p>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceManagement;
