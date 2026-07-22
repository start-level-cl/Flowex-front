import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck, User, ArrowRight, CheckCircle2, Building, UserCheck } from 'lucide-react';
import type { UserRole } from '../types';
import { mockCustomerProfile } from '../data/mockData';

interface LoginPageProps {
  setRole: (role: UserRole) => void;
  setUserEmail: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setRole, setUserEmail }) => {
  const navigate = useNavigate();
  const [enteredBy, setEnteredBy] = useState<'cliente' | 'vendedor'>('cliente');
  const [sellerName, setSellerName] = useState('Rodrigo Vendedor B2B');

  const handleLoginRole = (role: UserRole, email: string, targetPath: string) => {
    localStorage.setItem('flowex_user_role', role);
    localStorage.setItem('flowex_user_email', email);
    localStorage.setItem('flowex_entered_by', enteredBy);
    if (enteredBy === 'vendedor') {
      localStorage.setItem('flowex_seller_name', sellerName);
    }
    setRole(role);
    setUserEmail(email);
    navigate(targetPath);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-flow-bg via-white to-blue-50/50">
      
      {/* Title & Brand Intro */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-flow-primary text-flow-secondary rounded-2xl shadow-xl font-headline text-3xl font-extrabold mb-3 transform -rotate-3 hover:rotate-0 transition-all">
          FX
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-flow-primary tracking-tight">
          Flow<span className="text-flow-secondary">Ex</span> Portal Operativo
        </h1>
        <p className="mt-2 text-xs text-slate-600 font-body max-w-md mx-auto">
          Plataforma PMV de Gestión Logística con Autenticación de Roles (Cliente, Admin, Driver) y Trazabilidad en Tiempo Real.
        </p>
      </div>

      {/* Origin Selection: Cliente Directo vs Vendedor */}
      <div className="max-w-md mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-full mb-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
          <UserCheck className="w-4 h-4 mr-1.5 text-flow-primary" /> Identificador de Origen (Persistencia)
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setEnteredBy('cliente')}
            className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
              enteredBy === 'cliente'
                ? 'bg-flow-primary text-white border-flow-primary shadow'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            Cliente Directo
          </button>
          <button
            onClick={() => setEnteredBy('vendedor')}
            className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
              enteredBy === 'vendedor'
                ? 'bg-flow-secondary text-white border-flow-secondary shadow'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            Vendedor / Ejecutivo
          </button>
        </div>

        {enteredBy === 'vendedor' && (
          <div className="mt-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre del Vendedor</label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-secondary focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* Admin / Coordinador */}
        <div 
          onClick={() => handleLoginRole('admin', 'admin@flowex.cl', '/admin')}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-flow hover:border-flow-primary hover:shadow-flow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 bg-blue-50 text-flow-primary p-2 rounded-xl group-hover:bg-flow-primary group-hover:text-white transition-colors">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 bg-blue-100 text-flow-primary text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Rol: Admin / Coordinador
            </span>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-2">
              Panel de Administración
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Tabla operativa limpia, asignación de drivers por zona y edición de estados.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 mb-6">
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Zonificación Automática por Comuna</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Asignación Directa de Drivers</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Registro de Eventos (Audit Log)</li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 bg-flow-primary text-white font-semibold text-xs rounded-xl flex items-center justify-center group-hover:bg-blue-900 transition-colors shadow">
            Iniciar como Admin <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        {/* Driver / Conductor */}
        <div 
          onClick={() => handleLoginRole('driver', 'rgomez@flowex.cl', '/driver/route')}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-flow hover:border-flow-secondary hover:shadow-flow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 bg-orange-50 text-flow-secondary p-2 rounded-xl group-hover:bg-flow-secondary group-hover:text-white transition-colors">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 bg-orange-100 text-flow-secondary text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Rol: Conductor (Driver)
            </span>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-2">
              Ruta del Día & Terreno
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Vista simple filtrada para el repartidor (Ruta automática: Pagados + Pendientes).
            </p>
            <ul className="space-y-2 text-xs text-slate-500 mb-6">
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-flow-secondary" /> Cambio de Estado en Terreno</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-flow-secondary" /> Vista Liviana y Directa</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-flow-secondary" /> Disparo de Email Automático</li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 bg-flow-secondary text-white font-semibold text-xs rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow">
            Iniciar como Driver <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

        {/* Cliente */}
        <div 
          onClick={() => handleLoginRole('customer', mockCustomerProfile.email, '/customer/create')}
          className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-flow hover:border-slate-800 hover:shadow-flow-lg transition-all cursor-pointer group relative flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 bg-slate-100 text-slate-700 p-2 rounded-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
              Rol: Cliente Registrado
            </span>
            <h2 className="text-xl font-headline font-bold text-slate-900 mb-2">
              Ingreso de Pedidos
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Formulario con datos guardados, validación de cobertura de comunas y pasarela de pago.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 mb-6">
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-slate-600" /> Persistencia de Datos de Cliente</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-slate-600" /> Bloqueo Comunas sin Cobertura</li>
              <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-slate-600" /> Pasarela de Pago Embebida</li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 bg-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors shadow">
            Iniciar como Cliente <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
