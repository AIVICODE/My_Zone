import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../../services/geocoding';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON } from 'react-leaflet';

// Fix icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Componente para cambiar centro dinámicamente SIN tocar zoom
const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

// Forzar render correcto del mapa (ESSENCIAL!)
const ForceResize = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize(); // ¡Mágico!
    }, 0);
  }, [map]);
  return null;
};

// Manejamos el click directamente SIN mantener estado extra
const LocationMarker = ({ onLocationSelect, setShouldRecenter }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      onLocationSelect({ lat, lng, address });
      setShouldRecenter(false);
    },
  });

  return null;
};

const MapPage = ({ onLocationSelect, locationData, coveragePolygon }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [shouldRecenter, setShouldRecenter] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Obtener ubicación inicial
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMarkerPosition([latitude, longitude]);
          setShouldRecenter(true);
        },
        () => {
          console.log('Usuario no permitió geolocalización, usando centro por defecto.');
          setMapCenter([-34.9011, -56.1645]);
          setMarkerPosition([-34.9011, -56.1645]);
          setShouldRecenter(true);
        }
      );
    }
  }, []);

  // Si viene nueva ubicación
  useEffect(() => {
    if (locationData) {
      setMapCenter([locationData.lat, locationData.lng]);
      setMarkerPosition([locationData.lat, locationData.lng]);
      setShouldRecenter(true);
    }
  }, [locationData]);

  return (
    <MapContainer center={mapCenter} zoom={7} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ForceResize /> {/* ESTA ES LA CLAVE */}
      <LocationMarker
        onLocationSelect={(data) => {
          onLocationSelect(data);
          setMarkerPosition([data.lat, data.lng]);
          setShouldRecenter(false);
        }}
        setShouldRecenter={setShouldRecenter}
      />
      {shouldRecenter && <RecenterMap center={mapCenter} />}
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>{locationData ? locationData.address : 'Ubicación seleccionada'}</Popup>
        </Marker>
      )}

      {/* Polígono de cobertura */}
      {coveragePolygon && (
        <GeoJSON
          data={coveragePolygon}
          style={{
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.3
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapPage;
