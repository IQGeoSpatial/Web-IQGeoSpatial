import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el perfil del usuario
  const getProfile = async (user) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    // Este es el método más robusto:
    // 1. Intenta obtener la sesión inicial de forma explícita.
    // 2. Usa un bloque try/finally para GARANTIZAR que el estado de 'loading' se ponga en 'false'.
    const fetchInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(currentSession);
        if (currentSession) {
          const userProfile = await getProfile(currentSession.user);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        // Esto se ejecuta siempre, garantizando que la app nunca se quede "pegada".
        setLoading(false);
      }
    };

    fetchInitialSession();

    // 3. Escucha cambios futuros (login/logout en otra pestaña, etc.).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      const userProfile = newSession ? await getProfile(newSession.user) : null;
      setProfile(userProfile);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = { session, profile, loading };

  // El proveedor ahora solo se encarga de proveer el contexto.
  // Los componentes hijos decidirán qué mostrar basándose en el estado 'loading'.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};