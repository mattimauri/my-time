import { createContext, useState, useEffect } from 'react';
import { getProfile, logout } from '../../utils/api';
import api from '../../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  // Funzione per verificare se il token è valido
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now() + 30000; // 30 secondi di margine
    } catch {
      return false;
    }
  };

  // Al mount: verifica il token e carica il profilo
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      
      if (!storedToken || !isTokenValid(storedToken)) {
        // Token non valido o assente
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Token valido, imposta header e carica profilo
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);
        
        const profileResponse = await getProfile();
        setUser(profileResponse.user);
      } catch (error) {
        console.error('Errore caricamento profilo:', error);
        // Se il profilo fallisce, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (loginData) => {
    try {
      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('refreshToken', loginData.refreshToken);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${loginData.accessToken}`;
      
      setToken(loginData.accessToken);
      setUser(loginData.user);
      
      return { success: true };
    } catch (error) {
      console.error('Errore durante il login:', error);
      return { success: false, error: 'Errore durante il login' };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Errore durante il logout:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      handleLogin, 
      handleLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}