import React, { useState, useEffect } from 'react';
import MapPage from '../../components/map/page';
import StatsCharts from '../../components/charts';
import BusinessTypeSelector from '../../components/bussiness_type_selector';
import Header from '../../components/header';

import '../../styles/App.css';
import { geocodeAddress } from '../../services/geocoding';
import { FaSearchLocation, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { sendAnalysisData } from '../../services/api';

function Dashboard() {
  const [coveragePolygon, setCoveragePolygon] = useState(null);
  const [stats, setStats] = useState({
    coverage: 0,
    traffic: 0,
    amenities: 0,
  });
  const [inputAddress, setInputAddress] = useState('');
  const [latLng, setLatLng] = useState(null);
  const [businessType, setBusinessType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleLocationSelect = (data) => {
    setInputAddress(data.address);
    setLatLng({ lat: data.lat, lng: data.lng });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!inputAddress.trim()) return;

    const result = await geocodeAddress(inputAddress);
    if (result) {
      setInputAddress(result.address);
      setLatLng({ lat: result.lat, lng: result.lng });
    } else {
      alert('Address not found');
    }
  };

  const handleSubmitAnalysis = async () => {
    if (!inputAddress || !latLng || !businessType ) {
      alert('Please complete all fields before analyzing');
      return;
    }
  
    const payload = {
      direccion: inputAddress,  // Nombre correcto para el backend
      lat: latLng.lat,
      lng: latLng.lng,
      rubro: businessType,      // Nombre correcto para el backend
      inversion: parseFloat(0) // Nombre correcto y conversión a número
    };
  
    try {
      const result = await sendAnalysisData(payload);
      setCoveragePolygon(result.poligono_sin_cobertura || null); // Asegúrate que coincida con la respuesta
      setStats(result.stats || { coverage: 0, traffic: 0, amenities: 0 });
      alert(`Recomendación recibida: ${result.recomendacion}`); // Nombre correcto del campo
    } catch (err) {
      console.error('Error completo:', err);
      alert(`Error: ${err.response?.data?.detail || err.message}`);
    }
  };

  useEffect(() => {
    setCoveragePolygon(null);
    setStats({
      coverage: 0,
      traffic: 0,
      amenities: 0,
    });
  }, [inputAddress, businessType, investmentAmount]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header />

      <main className="flex flex-col flex-grow p-6 gap-6 w-full">
        <form onSubmit={handleAddressSubmit} className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-grow">
            <FaSearchLocation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              placeholder="Enter address..."
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            <FaMapMarkerAlt /> Search
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <BusinessTypeSelector businessType={businessType} setBusinessType={setBusinessType} />
        </div>

        {/* <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-gray-700 font-medium">Estimated Investment Amount (USD)</label>
          <input
            type="number"
            placeholder="e.g. 20000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div> */}

        <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-sm">
          <MapPage
            onLocationSelect={handleLocationSelect}
            locationData={latLng}
            coveragePolygon={coveragePolygon}
          />
        </div>

        <div className="w-full flex flex-col gap-4">
          <StatsCharts stats={stats} />
        </div>

        <div className="flex justify-end w-full">
          <button
            onClick={handleSubmitAnalysis}
            disabled={!inputAddress || !latLng || !businessType }
            className={`flex items-center gap-3 px-8 py-4 rounded-lg text-lg transition-all ${
              inputAddress && latLng && businessType
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-green-300 cursor-not-allowed text-white'
            }`}
          >
            <FaCheckCircle /> Analyze
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;