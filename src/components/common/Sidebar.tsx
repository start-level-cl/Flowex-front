import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  MapPin, 
  Smartphone, 
  Search, 
  FileSpreadsheet, 
  LogIn, 
  Layers,
  CreditCard
} from 'lucide-react';
import type { UserRole } from '../../types';

interface SidebarProps {
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-6">
        
        {/* Navigation Section */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Módulos del Sistema
          </div>
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  isActive ? 'bg-flow-bg text-flow-primary border-l-4 border-flow-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-flow-primary'
                }`
              }
            >
              <LogIn className="w-4 h-4 mr-2.5 text-slate-400" />
              Acceso y Selección de Rol
            </NavLink>

            {/* Customer Flow */}
            <div className="pt-3">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1">
                Portal Cliente
              </div>
              <NavLink
                to="/customer/orders"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <CreditCard className="w-4 h-4 mr-2.5 text-amber-600" />
                Mis Envíos (Pendientes Pago)
              </NavLink>
              <NavLink
                to="/customer/create"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-flow-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <FilePlus className="w-4 h-4 mr-2.5 text-blue-800" />
                Ingreso de Pedido
              </NavLink>
            </div>

            {/* Admin Flow */}
            <div className="pt-3">
              <div className="text-[10px] font-semibold text-flow-primary/70 uppercase tracking-wider px-3 mb-1">
                Operaciones & Auditoría
              </div>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-flow-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2.5 text-blue-800" />
                Panel de Administración
              </NavLink>
              <NavLink
                to="/admin/operations"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-flow-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <FileSpreadsheet className="w-4 h-4 mr-2.5 text-blue-800" />
                Gestión Operativa Fase 1
              </NavLink>
            </div>

            {/* Driver Flow */}
            <div className="pt-3">
              <div className="text-[10px] font-semibold text-flow-secondary uppercase tracking-wider px-3 mb-1">
                Conductor / Driver
              </div>
              <NavLink
                to="/driver/route"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-orange-50 text-flow-secondary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <MapPin className="w-4 h-4 mr-2.5 text-flow-secondary" />
                Gestión de Ruta Driver
              </NavLink>
              <NavLink
                to="/driver/daily"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-orange-50 text-flow-secondary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Smartphone className="w-4 h-4 mr-2.5 text-flow-secondary" />
                Ruta del Día (Terreno)
              </NavLink>
            </div>

            {/* Public Tracking */}
            <div className="pt-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Público
              </div>
              <NavLink
                to="/tracking"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <Search className="w-4 h-4 mr-2.5 text-slate-500" />
                Seguimiento de Envío (Público)
              </NavLink>
            </div>
          </nav>
        </div>

      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-200 pt-3">
        <div className="bg-flow-bg p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <div className="flex items-center space-x-2 font-semibold text-flow-primary mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Stitch Synchronized</span>
          </div>
          <p className="text-[10px] text-slate-500">
            FlowEx PMV 1.0 • Vercel Ready
          </p>
        </div>
      </div>
    </aside>
  );
};
