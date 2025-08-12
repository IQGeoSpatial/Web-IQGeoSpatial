// supabase/functions/chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
 
// Define la estructura de un mensaje en la conversación para mayor seguridad
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
// Define cuántos de los últimos mensajes se enviarán como contexto.
// Un número entre 6 y 10 (3-5 intercambios) es un buen punto de partida.
const CONVERSATION_HISTORY_LIMIT = 8;

serve(async (req) => {
  // Manejo de la petición pre-vuelo CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verificación robusta de la API Key antes de usarla
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('La variable de entorno OPENAI_API_KEY no está definida en Supabase.');
    }
    const openAI = new OpenAI(apiKey);

    // 2. Extracción y tipado seguro del cuerpo de la petición
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    if (!messages || !Array.isArray(messages)) {
      throw new Error('El campo "messages" es requerido y debe ser un array.');
    }

    // Prompt del sistema para darle contexto a la IA sobre tu empresa
    const systemPrompt = {
      role: 'system',
      content: `Eres un asistente virtual amigable y profesional para la empresa "IQ GeoSpatial Technology". Tu objetivo es responder preguntas sobre la empresa y sus servicios.
      
      Información clave de la empresa:
      - Nombre: IQ GeoSpatial Technology
      - Misión: Diseñar soluciones inteligentes que transforman datos territoriales en tecnología aplicable a escala local y global.
      - Visión: Ser un referente global en innovación geoespacial, desarrollando tecnologías que transformen la gestión territorial y conecten comunidades.
      - Equipo principal: Cesar Quintana (CEO y Fundador), Alison Quintana (CTO), y Mia Oxcenford (Jefe de Desarrollo GIS).
      - Servicios principales: Análisis Espacial, WebGIS, Consultoría Geoespacial, y Procesamiento de Imágenes Satelitales.
      - Software: La empresa desarrolla software de escritorio a medida para potenciar proyectos geoespaciales.
      
      Tu tono debe ser conciso y útil. Si no sabes una respuesta, di que no tienes esa información y que para más detalles pueden contactar a info@iqgeospatial.com.`
    };

    // Limita el historial de la conversación para controlar costos y tamaño del payload
    const limitedMessages: ChatMessage[] = messages.slice(-CONVERSATION_HISTORY_LIMIT);

    // Llama a la API de OpenAI con el contexto y el historial de mensajes LIMITADO
    const completion = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [systemPrompt, ...limitedMessages],
      max_tokens: 256,
      temperature: 0.7,
    });

    // 3. Verificación de que la IA realmente devolvió una respuesta
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      // Esto puede pasar si el contenido es filtrado por OpenAI o hay otro problema
      throw new Error('La IA no generó una respuesta válida.');
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // Loguea el error completo en la consola de Supabase para facilitar la depuración
    console.error('Error detallado en la función chat:', error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
