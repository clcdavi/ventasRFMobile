import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Determina la URL del backend
const getBackendUrl = () => {
  // URL del backend real alojado en Oracle Cloud
  return 'http://137.131.245.249:8081';

  /*
  // hostUri contiene la IP de la máquina de desarrollo (ej: 192.168.1.50:8081)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:8080`; // Puerto de Flask por defecto
  }

  // Fallbacks tradicionales
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080'; // Acceso al localhost de la máquina desde emulador Android
  }
  return 'http://localhost:8080'; // Simulador iOS o Web
  */
};

export const API_BASE_URL = getBackendUrl();

console.log('[ventasRF Mobile] Backend API Base URL:', API_BASE_URL);
