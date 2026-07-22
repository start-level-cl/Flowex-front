import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck, Search, ArrowRight, CheckCircle } from 'lucide-react';
import type { UserRole } from '../types';

interface LoginPageProps {
  setRole: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setRole }) => {
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-flow-bg via-white to-blue-50/50">
      
      {/* Title & Brand Intro */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-flow-primary text-flow-secondary rounded-2xl shadow-xl font-headline text-3xl font-extrabold mb-4 transform -rotate-3 hover:rotate-0 transition-all">
          FX
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-flow-primary tracking-tight">
          Flow<span className="text-flow-secondary">Ex</span> Portal
        </h1>
        <p className="mt-2 text-sm text-slate-600 font-body">
          Sistema de Gestión Logística, Auditoría Operativa y Control de Envíos en Tiempo Real
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* Admin / Ops */}
        <div 
          onClick={() => handleSelectRole('admin', '/admin')}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-flow hover:border-flow-primary hover:shadow-flow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 bg-blue-50 text-flow-primary p-2 rounded-xl group-hover:bg-flow-primary group-hover:text-white transition-colors">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 bg-blue-100 text-flow-primary text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Módulo Administrativo
            </span>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-2">
              Gestión Operativa & Audit
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Control de envíos, asignación de manifiestos, creación de nuevos pedidos y auditoría en tiempo real.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 mb-6">
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Monitoreo KPIs de Envíos</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Formulario de Pedido Inteligente</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Logs de Auditoría Logística</li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 bg-flow-primary text-white font-semibold text-xs rounded-xl flex items-center justify-center group-hover:bg-blue-900 transition-colors shadow">
            Acceder como Operador <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        {/* Driver / Conductor */}
        <div 
          onClick={() => handleSelectRole('driver', '/driver/route')}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-flow hover:border-flow-secondary hover:shadow-flow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 bg-orange-50 text-flow-secondary p-2 rounded-xl group-hover:bg-flow-secondary group-hover:text-white transition-colors">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 bg-orange-100 text-flow-secondary text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Portal del Transportista
            </span>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-2">
              Ruta del Conductor
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Despacho de entregas en calle, hoja de ruta diaria, confirmación de entregas (POD) y gestión de novedades.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 mb-6">
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-flow-secondary" /> Mapa interactivo de paradas</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-flow-secondary" /> Vista optimizada Desktop & Mobile</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-flow-secondary" /> Carga de firmas & prueba de entrega</li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 bg-flow-secondary text-white font-semibold text-xs rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow">
            Iniciar Ruta Driver <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        {/* Cliente Público */}
        <div 
          onClick={() => handleSelectRole('customer', '/tracking')}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-flow hover:border-slate-800 hover:shadow-flow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 bg-slate-100 text-slate-700 p-2 rounded-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Consulta de Envíos
            </span>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-2">
              Seguimiento Público
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Consulta inmediata del estado de paquetes para clientes finales mediante código de seguimiento o guía de despacho.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 mb-6">
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-slate-600" /> Timeline cronológico en vivo</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-slate-600" /> Estimación de entrega precisa</li>
              <li className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-2 text-slate-600" /> Información de contacto del courier</li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors shadow">
            Rastrear un Envío <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

      </div>

      {/* Direct Quick Demo Actions */}
      <div className="mt-10 text-center max-w-xl mx-auto bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
        <span className="font-semibold text-flow-primary">Demostración Rápida de Envíos Registrados:</span>
        <div className="mt-2 flex flex-wrap justify-center gap-2 font-mono">
          <button 
            onClick={() => navigate('/tracking?code=FX-9842-8812-CL')} 
            className="px-2.5 py-1 bg-blue-50 text-flow-primary rounded hover:bg-blue-100 transition-colors border border-blue-200"
          >
            FX-9842-8812-CL (En Tránsito)
          </button>
          <button 
            onClick={() => navigate('/tracking?code=FX-7721-3094-CL')} 
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            FX-7721-3094-CL (Entregado)
          </button>
          <button 
            onClick={() => navigate('/tracking?code=FX-1102-9988-CL')} 
            className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded hover:bg-rose-100 transition-colors border border-rose-200"
          >
            FX-1102-9988-CL (Incidencia)
          </button>
        </div>
      </div>

    </div>
  );
};
