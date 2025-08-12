import { createClient } from '@supabase/supabase-js';

// Estas son las variables de entorno. DEBES REEMPLAZARLAS con tus propias credenciales de Supabase.
// Puedes encontrarlas en tu proyecto Supabase, en "Settings" -> "API".
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Asegúrate de que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY no están definidas.');
  console.error('Por favor, crea un archivo .env en la raíz de tu proyecto con:');
  console.error('REACT_APP_SUPABASE_URL=TU_URL_DE_SUPABASE');
  console.error('REACT_APP_SUPABASE_ANON_KEY=TU_ANON_KEY_DE_SUPABASE');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);