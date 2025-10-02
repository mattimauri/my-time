import axios from 'axios';

// const BASE_URL = 'https://z098--secure-api--9467bf7t4qkk.code.run/api';
const BASE_URL = 'http://localhost:3001/api';

// Istanza Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor request: attacca accessToken se presente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response semplificato
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Nessun refresh token disponibile');

        const { data } = await axios.post(`${BASE_URL}/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Ritenta la richiesta originale con il nuovo access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Fallback: pulizia e reject
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// === API ===
export const refreshTokens = async (refreshToken) => {
  const { data } = await axios.post(`${BASE_URL}/refresh`, { refreshToken });
  return data; // { accessToken, refreshToken }
};

export const login = async (taxCode, password) => {
  const response = await api.post('/login', { tax_code: taxCode, password });
  return response.data;
};

export const register = async (email, password, tax_code) => {
  const response = await api.post('/registrati', { email, password, tax_code });
  return response;
};

// Genera report PDF
export const generateReport = async (reportData) => {
  const response = await api.post('/working-status-changes/report', reportData);
  return response.data;
};

// Crea record con orario custom (solo admin)
export const createCustomRecord = async (recordData) => {
  const response = await api.post('/working-status-changes/custom', recordData);
  return response.data;
};


export const logout = async () => {
  await api.post('/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const getUserByTaxCode = async (taxCode) => {
  const response = await api.get(`/utenti/tax_code/${taxCode}`);
  return response.data;
};

export const updateUserProfile = async (userId, userData) => {
  const response = await api.put(`/utenti/${userId}`, userData);
  return response.data;
};

export const updateWorkingStatus = async (userId, working_status) => {
  const response = await api.put(`/utenti/${userId}/working-status`, { working_status });
  return response.data;
};

// Nel file utils/api.js
export const getWorkingStatusChanges = async (taxCode, month, year) => {
  const params = { tax_code: taxCode };
  
  if (month && year) {
    params.month = month;
    params.year = year;
  }
  
  const response = await api.get('/working-status-changes', { params });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/utenti');
  return response.data;
};

export const searchUsers = async (searchTerm) => {
  const response = await api.get(`/utenti?search=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// Funzione forgotPassword con axios diretto
export const forgotPassword = async (taxCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { 
      tax_code: taxCode 
    });
    return response.data;
  } catch (error) {
    console.error('Error in forgotPassword API call:', error);
    throw error;
  }
};

export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password`, {
      token,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error in resetPassword API call:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/utenti/${id}`);
  return response.data;
};

export default api;