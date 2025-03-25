import React, { useState,useEffect } from 'react';
import MapPage from '../../components/map/page';
import StatsCharts from '../../components/map/charts';

import '../../styles/App.css';
import { geocodeAddress } from '../../services/geocoding';
import { FaSearchLocation, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { sendAnalysisData } from '../../services/api'; // Importamos API service


function Dashboard() {
  const [coveragePolygon, setCoveragePolygon] = useState(null);
  const [stats, setStats] = useState(null);

  const [inputAddress, setInputAddress] = useState('');
  const [latLng, setLatLng] = useState(null); // Guardar latitud y longitud
  const [businessType, setBusinessType] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Cuando el usuario selecciona en el mapa, actualizamos todo
  const handleLocationSelect = (data) => {
    setInputAddress(data.address); // Actualiza input de dirección
    setLatLng({ lat: data.lat, lng: data.lng });
  };

  // Si escribe dirección manual, buscar coordenadas
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (inputAddress.trim() === '') return;

    const result = await geocodeAddress(inputAddress);
    if (result) {
      setInputAddress(result.address);
      setLatLng({ lat: result.lat, lng: result.lng });
    } else {
      alert('Dirección no encontrada');
    }
  };

  const handleSubmitAnalysis = async () => {
    if (!inputAddress || !latLng || !businessType || !investmentAmount) {
      alert('Completa todos los campos antes de analizar');
      return;
    }

    const payload = {
      direccion: inputAddress,
      lat: latLng.lat,
      lng: latLng.lng,
      rubro: businessType,
      inversion: investmentAmount,
    };

    try {
     

      const result = await sendAnalysisData(payload);
      if (result.poligono_sin_cobertura) {
        setCoveragePolygon(result.poligono_sin_cobertura);
      }
      if (result.stats) {
        setStats(result.stats);
      }
      alert(`Recomendación recibida: ${result.recomendacion}`); // Según lo que devuelva el backend
    } catch (err) {
      alert('Hubo un error al enviar los datos.');
    }
  };

  useEffect(() => {
    setCoveragePolygon(null);
    setStats(null);
  }, [inputAddress, businessType, investmentAmount]);
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">

      {/* Header */}
      <header className="w-full p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col flex-grow p-8 gap-8">

        {/* Formulario dirección */}
        <form onSubmit={handleAddressSubmit} className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative w-full">
            <FaSearchLocation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <input
              type="text"
              placeholder="Ingrese dirección..."
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            <FaMapMarkerAlt />
            Buscar
          </button>
        </form>

        {/* Rubro */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-gray-700 font-medium">Tipo de Local</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccione un rubro</option>

            {/* Restauración y Alimentación */}
            <option value="amenity=cafe">Cafetería</option>
            <option value="amenity=restaurant">Restaurante</option>
            <option value="amenity=fast_food">Comida Rápida</option>
            <option value="amenity=bar">Bar</option>
            <option value="amenity=ice_cream">Heladería</option>
            <option value="shop=bakery">Panadería</option>

            {/* Compras y Retail */}
            <option value="shop=clothes">Tienda de Ropa</option>
            <option value="shop=supermarket">Supermercado</option>
            <option value="shop=furniture">Mueblería</option>
            <option value="shop=electronics">Electrónica</option>
            <option value="shop=convenience">Tienda Conveniencia</option>
            <option value="shop=florist">Floristería</option>
            <option value="shop=butcher">Carnicería</option>
            <option value="shop=beauty">Tienda de Belleza</option>

            {/* Servicios */}
            <option value="amenity=pharmacy">Farmacia</option>
            <option value="amenity=bank">Banco</option>
            <option value="amenity=atm">Cajero Automático</option>
            <option value="amenity=car_rental">Alquiler de Autos</option>
            <option value="shop=hairdresser">Peluquería</option>
            <option value="amenity=post_office">Correo</option>

            {/* Educación */}
            <option value="amenity=school">Escuela</option>
            <option value="amenity=university">Universidad</option>
            <option value="amenity=kindergarten">Jardín Infantil</option>
            <option value="amenity=library">Biblioteca</option>

            {/* Oficinas y Negocios */}
            <option value="office=coworking">Coworking</option>
            <option value="office=company">Oficina Corporativa</option>
            <option value="office=estate_agent">Inmobiliaria</option>
            <option value="office=government">Oficina Gubernamental</option>
            <option value="office=insurance">Seguros</option>
            <option value="office=lawyer">Estudio Jurídico</option>
            <option value="office=telecommunication">Telecomunicaciones</option>

            {/* Turismo y Hospedaje */}
            <option value="tourism=hotel">Hotel</option>
            <option value="tourism=guest_house">Casa de Huéspedes</option>
            <option value="tourism=hostel">Hostel</option>
            <option value="tourism=motel">Motel</option>
            <option value="tourism=information">Centro de Información Turística</option>

            {/* Salud */}
            <option value="amenity=clinic">Clínica</option>
            <option value="amenity=dentist">Dentista</option>
            <option value="amenity=hospital">Hospital</option>
            <option value="amenity=doctors">Consultorio Médico</option>
            <option value="amenity=optician">Óptica</option>

            {/* Fitness y Recreación */}
            <option value="leisure=fitness_centre">Gimnasio</option>
            <option value="leisure=sports_centre">Centro Deportivo</option>
            <option value="leisure=swimming_pool">Piscina</option>
            <option value="leisure=park">Parque</option>

            {/* Otros */}
            <option value="amenity=parking">Estacionamiento</option>
            <option value="amenity=marketplace">Mercado</option>
            <option value="amenity=place_of_worship">Lugar de culto</option>
          </select>

        </div>

        {/* Inversión */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-gray-700 font-medium">Monto estimado de inversión (USD)</label>
          <input
            type="number"
            placeholder="Ej: 20000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Mapa */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-sm">
          <MapPage onLocationSelect={handleLocationSelect} locationData={latLng} coveragePolygon={coveragePolygon} />
        </div>

        {/* Gráficas de porcentaje */}
        <StatsCharts stats={stats} />

        {/* Botón Analizar */}
        <div className="flex justify-end w-full">
          <button
            onClick={handleSubmitAnalysis}
            disabled={!inputAddress || !latLng || !businessType || !investmentAmount}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg text-lg transition-all ${inputAddress && latLng && businessType && investmentAmount
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-green-300 text-white cursor-not-allowed'
              }`}
          >
            <FaCheckCircle />
            Analizar
          </button>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
