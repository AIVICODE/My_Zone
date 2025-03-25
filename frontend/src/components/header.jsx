import { useState } from 'react';
import { MapPin, Compass, Layers, Menu } from "lucide-react";
import icono from '../assets/myzone.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="w-full px-6 py-4 border-b shadow-sm"
      style={{ backgroundColor: "#f6f6f6" }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <img src={icono} alt="Dashboard Icon" className="h-10 w-10" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to My Zone</h1>
            <p className="text-sm text-gray-500">Location Intelligence Platform</p>
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Locations</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
            <Compass className="h-4 w-4" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Territories</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Locations</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
            <Compass className="h-4 w-4" />
            <span className="text-sm font-medium">Analytics</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Territories</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;