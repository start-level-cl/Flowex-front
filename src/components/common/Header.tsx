import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, Truck, Globe, Bell } from 'lucide-react';
import type { UserRole } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, setRole }) => {
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      navigate(`/tracking?code=${encodeURIComponent(searchCode.trim())}`);
    }
  };

  return (
    <header className="bg-flow-primary text-white border-b border-blue-900 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-flow-secondary rounded-xl flex items-center justify-center font-headline font-extrabold text-white text-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
            FX
          </div>
          <div>
            <span className="font-headline text-xl font-bold tracking-tight text-white">Flow<span className="text-flow-secondary">Ex</span></span>
            <span className="block text-[10px] text-blue-200 tracking-wider font-mono">LOGISTICS VELOCITY</span>
          </div>
        </div>

        {/* Global Quick Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar Nº de Guía / Tracking..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full bg-blue-950/60 border border-blue-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-flow-secondary focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-blue-300 absolute left-2.5 top-2" />
          </div>
        </form>

        {/* Dynamic Role Switcher & Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-blue-950/80 p-1 rounded-lg border border-blue-800 text-xs">
            <button
              onClick={() => { setRole('admin'); navigate('/admin'); }}
              className={`flex items-center px-2.5 py-1 rounded-md transition-colors font-medium ${
                currentRole === 'admin' ? 'bg-flow-secondary text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              Admin / Ops
            </button>
            <button
              onClick={() => { setRole('driver'); navigate('/driver/route'); }}
              className={`flex items-center px-2.5 py-1 rounded-md transition-colors font-medium ${
                currentRole === 'driver' ? 'bg-flow-secondary text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5 mr-1" />
              Driver
            </button>
            <button
              onClick={() => { setRole('customer'); navigate('/tracking'); }}
              className={`flex items-center px-2.5 py-1 rounded-md transition-colors font-medium ${
                currentRole === 'customer' ? 'bg-flow-secondary text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 mr-1" />
              Cliente
            </button>
          </div>

          {/* Notifications & User Avatar */}
          <div className="flex items-center space-x-2 border-l border-blue-800 pl-3">
            <button className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-blue-800/50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-flow-secondary rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2 bg-blue-900/40 px-2 py-1 rounded-lg">
              <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                {currentRole === 'admin' ? 'OP' : currentRole === 'driver' ? 'RG' : 'CL'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold leading-none">
                  {currentRole === 'admin' ? 'Ricardo Barría' : currentRole === 'driver' ? 'Roberto Gómez' : 'Cliente Público'}
                </p>
                <p className="text-[10px] text-blue-300 leading-tight">
                  {currentRole === 'admin' ? 'Auditor General' : currentRole === 'driver' ? 'Unidad KJL-942' : 'Tracking Activo'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
