import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, UploadCloud } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const SiteContentManagement = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa
  const [altText, setAltText] = useState(''); // Nuevo estado para el texto alternativo

  const fetchCarouselImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('homepage_carousel').select('*').order('created_at');
    if (error) {
      console.error('Error fetching carousel images:', error);
    } else {
      setCarouselImages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Crear URL temporal para la vista previa
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Por favor, selecciona un archivo de imagen.');
      return;
    }
    setIsSubmitting(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `carousel/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName);

      // Usamos el texto alternativo del estado, con un fallback por si acaso.
      const { error: insertError } = await supabase.from('homepage_carousel').insert([{ 
        image_url: publicUrl, 
        alt_text: altText || 'Imagen de carrusel' 
      }]);
      if (insertError) throw insertError;

      alert('¡Imagen añadida al carrusel!');
      setIsModalOpen(false);
      setImageFile(null); // Limpiar estado
      setImagePreview(null); // Limpiar vista previa
      setAltText('');    // Limpiar estado
      fetchCarouselImages();

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (image) => {
    if (window.confirm('¿Seguro que quieres eliminar esta imagen del carrusel?')) {
      try {
        const { error: deleteDbError } = await supabase.from('homepage_carousel').delete().eq('id', image.id);
        if (deleteDbError) throw deleteDbError;

        const filePath = new URL(image.image_url).pathname.split('/site-assets/')[1];
        await supabase.storage.from('site-assets').remove([filePath]);

        alert('Imagen eliminada.');
        fetchCarouselImages();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const openAddModal = () => {
    setImageFile(null);
    setAltText('');
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Liberar memoria de la vista previa anterior
    }
    setImagePreview(null);
    setIsModalOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Carrusel de Inicio</h2>
        <button onClick={openAddModal} className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <PlusCircle size={20} /> Añadir Imagen
        </button>
      </div>

      {loading ? <p>Cargando imágenes...</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {carouselImages.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <button onClick={() => handleDelete(img)} className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Subir Nueva Imagen</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 mb-1">Texto Alternativo (Descripción)</label>
                  <input
                    id="alt_text"
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Ej: Vista panorámica de un valle montañoso"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Describe la imagen para accesibilidad (importante para SEO y lectores de pantalla).</p>
                </div>
                <div>
                  <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">Archivo de Imagen</label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Sube un archivo</span>
                        <input id="image-upload" type="file" onChange={handleFileChange} accept="image/*" required className="sr-only"/>
                      </label>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      {imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-4 mx-auto max-h-40 rounded-lg shadow-md" />}
                      {imageFile && <p className="text-sm text-green-600 mt-2">{imageFile.name}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isSubmitting ? 'Subiendo...' : 'Subir'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SiteContentManagement;