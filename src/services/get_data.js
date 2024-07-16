import axios from 'axios';

const obtenerDatos = async (url) => {
  try {
    const respuesta = await axios.get(`${url}`);
    return respuesta.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export default obtenerDatos;