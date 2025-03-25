import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Cambia si el backend está en otro lado

export const sendAnalysisData = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, data);
    return response.data;
  } catch (error) {
    console.error('Error enviando datos:', error);
    throw error;
  }
};
