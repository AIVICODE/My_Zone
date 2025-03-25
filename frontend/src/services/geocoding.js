// Reverse Geocoding: Coordenadas -> Dirección
export const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'MiApp-Geocoding' }
      });
      const data = await res.json();
      return data.display_name;
    } catch (err) {
      console.error('Error obteniendo dirección:', err);
      return 'No se pudo obtener dirección';
    }
  };
  
  // Direct Geocoding: Dirección -> Coordenadas
  export const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'MiApp-Geocoding' }
      });
      const data = await res.json();
      
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon), address: display_name };
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error geocodificando dirección:', err);
      return null;
    }
  };
  