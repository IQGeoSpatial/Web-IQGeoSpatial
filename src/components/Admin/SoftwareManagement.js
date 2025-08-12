import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit, Trash2, UploadCloud, Paperclip, Video } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const SoftwareManagement = ({ initialSoftware, onDataChange }) => {
  const [softwareList, setSoftwareList] = useState(initialSoftware || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSoftware, setCurrentSoftware] = useState({ name: '', description: '', video_url: '' });
  
  // Estados separados para cada archivo
  const [imageFile, setImageFile] = useState(null);
  const [installerFile, setInstallerFile] = useState(null);
  const [docFile, setDocFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setSoftwareList(initialSoftware);
  }, [initialSoftware]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSoftware(prev => ({ ...prev, [name]: value }));
  };

  // Función genérica para subir un archivo y devolver su URL
  const uploadFile = async (file, folder) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('site-assets').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentSoftware.name) {
      alert('El nombre del software es obligatorio.');
      return;
    }

    // Comprobación del tamaño del archivo ANTES de intentar subirlo
    const MAX_SIZE_MB = 50;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (installerFile && installerFile.size > MAX_SIZE_BYTES) {
      alert(`Error: El instalador "${installerFile.name}" (${(installerFile.size / 1024 / 1024).toFixed(2)} MB) excede el límite de ${MAX_SIZE_MB} MB del plan gratuito de Supabase.`);
      return; // Detener la ejecución si el archivo es demasiado grande
    }

    setIsSubmitting(true);

    try {
      // Lógica más explícita para determinar la URL del instalador
      let finalInstallerUrl = currentSoftware.installer_url; // 1. Empezamos con la URL del campo de texto.
      if (installerFile) {
        // 2. Si se seleccionó un archivo, lo subimos y su URL sobreescribe la anterior.
        finalInstallerUrl = await uploadFile(installerFile, 'software-installers');
      }

      const imageUrl = await uploadFile(imageFile, 'software-images');
      const docUrl = await uploadFile(docFile, 'software-docs');

      const softwareData = {
        ...currentSoftware,
        image_url: imageUrl || currentSoftware.image_url,
        installer_url: finalInstallerUrl, // 3. Usamos la URL final determinada.
        documentation_url: docUrl || currentSoftware.documentation_url
      };

      const { error } = isEditMode
        ? await supabase.from('software_products').update(softwareData).eq('id', currentSoftware.id)
        : await supabase.from('software_products').insert([softwareData]);

      if (error) throw error;

      alert(`Software ${isEditMode ? 'actualizado' : 'añadido'} con éxito!`);
      setIsModalOpen(false);
      onDataChange();

    } catch (error) {
      console.error('Error detallado al guardar el software:', error);
      if (error.message.includes('exceeded the maximum allowed size')) {
        alert('Error: El archivo es demasiado grande. El límite actual es de 50MB. Puedes aumentar este límite en la configuración del bucket "site-assets" en tu panel de Supabase.');
      } else if (error.message.includes('security policy') || error.message.includes('permission denied')) {
        alert('Error de permisos: No se pudo subir el archivo. Revisa las políticas de seguridad (Policies) de tu bucket en Supabase.');
      } else {
        alert(`Error inesperado: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (software) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${software.name}"?`)) {
      try {
        // Eliminar de la base de datos
        const { error } = await supabase.from('software_products').delete().eq('id', software.id);
        if (error) throw error;

        // Eliminar archivos asociados de Storage
        const filesToDelete = [software.image_url, software.installer_url, software.documentation_url]
          .filter(Boolean) // Filtrar nulos o vacíos
          .map(url => new URL(url).pathname.split('/site-assets/')[1]);

        if (filesToDelete.length > 0) {
          await supabase.storage.from('site-assets').remove(filesToDelete);
        }

        alert('Software eliminado con éxito.');
        onDataChange();
      } catch (error) {
        console.error('Error al eliminar el software:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentSoftware({ name: '', description: '', video_url: '' });
    setImageFile(null);
    setInstallerFile(null);
    setDocFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (software) => {
    setIsEditMode(true);
    setCurrentSoftware(software);
    setImageFile(null);
    setInstallerFile(null);
    setDocFile(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Software</h2>
        <button onClick={openAddModal} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
          <PlusCircle size={20} /> Añadir Software
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Nombre</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Archivos</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {softwareList.map((sw) => (
              <tr key={sw.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-800">{sw.name}</td>
                <td className="py-4 px-6 flex gap-4">
                  {sw.image_url && <a href={sw.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Imagen</a>}
                  {sw.installer_url && <a href={sw.installer_url} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Instalador</a>}
                  {sw.documentation_url && <a href={sw.documentation_url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">Docs</a>}
                  {sw.video_url && <a href={sw.video_url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">Video</a>}
                </td>
                <td className="py-4 px-6 flex gap-3 items-center">
                  <button onClick={() => openEditModal(sw)} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit size={20} /></button>
                  <button onClick={() => handleDelete(sw)} className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Editar Software' : 'Añadir Nuevo Software'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos de texto */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Software</label>
                  <input type="text" name="name" id="name" value={currentSoftware.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea name="description" id="description" rows="3" value={currentSoftware.description} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                </div>
                <div>
                  <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-1">URL del Video (YouTube, Vimeo, etc.)</label>
                  <input type="url" name="video_url" id="video_url" value={currentSoftware.video_url} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>

                {/* Campos de archivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                  {imageFile && <p className="text-xs text-gray-500 mt-1">Tamaño: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instalador (.exe, .zip, etc.)</label>
                  <input type="file" onChange={(e) => setInstallerFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                  {installerFile && <p className="text-xs text-gray-500 mt-1">Tamaño: {(installerFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>

                <div className="text-center my-2">
                  <span className="text-gray-500 font-semibold">O</span>
                </div>

                <div>
                  <label htmlFor="installer_url" className="block text-sm font-medium text-gray-700 mb-1">Pega la URL de Descarga Directa</label>
                  <input type="url" name="installer_url" id="installer_url" value={currentSoftware.installer_url || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="https://drive.google.com/..." />
                  <p className="text-xs text-gray-500 mt-1">
                    Usa esta opción si tu archivo pesa más de 50MB. Si seleccionas un archivo para subir, esta URL será ignorada.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documentación (.pdf)</label>
                  <input type="file" onChange={(e) => setDocFile(e.target.files[0])} accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
                  {docFile && <p className="text-xs text-gray-500 mt-1">Tamaño: {(docFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SoftwareManagement;
