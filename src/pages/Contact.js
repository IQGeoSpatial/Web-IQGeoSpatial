import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario, por ejemplo, a una API
    console.log('Formulario enviado:', formData);
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
    setFormData({ name: '', email: '', message: '' }); // Limpiar formulario
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
        Contáctanos
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        ¿Tienes alguna pregunta, proyecto o simplemente quieres saludar? ¡Estamos aquí para escucharte!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Correo Electrónico</h3>
              <p className="text-gray-600">info@iqgeospatial.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Teléfono</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Oficina Principal</h3>
              <p className="text-gray-600">123 Calle Geo, Ciudad Espacial, País</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Síguenos en Redes Sociales</h2>
            <div className="flex gap-4">
              {/* Aquí podrías añadir iconos de redes sociales */}
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.002 3.714.051 1.05.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.248.638.415 1.378.465 2.428.049.93.051 1.286.051 3.714s-.002 2.784-.051 3.714c-.05.1.217 1.79-.465 2.428a4.908 4.908 0 01-1.153 1.772c-.254.66-.598 1.216-1.153 1.772a4.908 4.908 0 01-1.772 1.153c-.638.248-1.378.415-2.428.465-.93.049-1.286.051-3.714.051s-2.784-.002-3.714-.051c-1.05-.05-1.79-.217-2.428-.465a4.908 4.908 0 01-1.772-1.153c-.66-.254-1.216-.598-1.772-1.153a4.908 4.908 0 01-1.153-1.772c-.248-.638-.415-1.378-.465-2.428-.049-.93-.051-1.286-.051-3.714s.002-2.784.051-3.714c.05-1.05.217-1.79.465-2.428a4.908 4.908 0 011.153-1.772c.254-.66.598-1.216 1.153-1.772A4.908 4.908 0 015.636 2.465c.638-.248 1.378-.415 2.428-.465C9.047 2.002 9.401 2 12.315 2zm0 2.16c-2.727 0-3.064.003-4.122.056-.95.046-1.58.19-2.097.387a2.17 2.17 0 00-1.173.865 2.17 2.17 0 00-.865 1.173c-.197.517-.341 1.147-.387 2.097-.053 1.058-.056 1.395-.056 4.122s.003 3.064.056 4.122c.046.95.19 1.58.387 2.097a2.17 2.17 0 00.865 1.173c.517.197 1.147.341 2.097.387 1.058.053 1.395.056 4.122.056s3.064-.003 4.122-.056c.95-.046 1.58-.19 2.097-.387a2.17 2.17 0 001.173-.865 2.17 2.17 0 00.865-1.173c.197-.517.341-1.147.387-2.097.053-1.058.056-1.395.056-4.122s-.003-3.064-.056-4.122c-.046-.95-.19-1.58-.387-2.097a2.17 2.17 0 00-.865-1.173 2.17 2.17 0 00-1.173-.865c-.517-.197-1.147-.341-2.097-.387C15.376 4.163 15.039 4.16 12.315 4.16zm0 1.868c3.432 0 6.218 2.786 6.218 6.218S15.747 18.464 12.315 18.464 6.097 15.678 6.097 12.246s2.786-6.218 6.218-6.218zm0 2.16a4.058 4.058 0 100 8.116 4.058 4.058 0 000-8.116z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Añade más iconos según necesites */}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                Tu Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Escribe tu nombre completo"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Tu Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="ejemplo@dominio.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                Tu Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Cuéntanos cómo podemos ayudarte..."
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="mr-3" /> Enviar Mensaje
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;