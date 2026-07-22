import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Navigation, Phone, ArrowRight } from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const RouteDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState(mockOrders);

  const routeDriverName = 'Roberto Gómez';
  const vehiclePlate = 'KJL-942 (Furgón Mercedes Sprinter)';
  const zone = 'Zona Costa Viña (Z-3)';

  return (
    <div className="space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 4, title: 'Zonificación Automática Asignada al Driver' },
          { num: 6, title: 'Generación Automática de Ruta del Día (Pagados + Pendientes)' }
        ]}
      />

      {/* Driver Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-flow-secondary uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Consola del Transportista
          </span>
          <h1 className="text-2xl font-headline font-bold text-slate-900 mt-2">
            Gestión de Ruta Driver (Fase 1)
          </h1>
          <p className="text-xs text-slate-600">
            Conductor: <span className="font-semibold text-slate-900">{routeDriverName}</span> | Vehículo: <span className="font-mono text-slate-800">{vehiclePlate}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/driver/daily')}
          className="flex items-center px-4 py-2.5 bg-flow-secondary hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow transition-colors"
        >
          Iniciar Hoja de Ruta Diaria <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>
      </div>

      {/* Route Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Zona Asignada</span>
          <p className="text-sm font-bold text-flow-primary mt-1">{zone}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Paradas</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Entregadas</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Distancia Estimada</span>
          <p className="text-xl font-bold text-flow-secondary mt-1">42.5 km</p>
        </div>
      </div>

      {/* Map Simulation & Stops Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visualiser Mock */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-flow flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          
          {/* Mock Map Background Grids */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Navigation className="w-4 h-4 text-flow-secondary animate-pulse" />
              <span className="text-xs font-semibold">GPS Asignado en Vivo</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Última sincro: Hace 1 min</span>
          </div>

          {/* Map Stops Visual Trail */}
          <div className="my-8 z-10 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Secuencia de Ruta:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {orders.map((order, idx) => (
                <div key={order.id} className={`p-3 rounded-xl border text-xs ${
                  order.status === 'delivered' 
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200' 
                    : order.status === 'transit'
                    ? 'bg-orange-950/80 border-flow-secondary text-orange-100 ring-2 ring-flow-secondary'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}>
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span>Parada #{idx + 1}</span>
                    <span className="text-[10px] uppercase font-mono">{order.status}</span>
                  </div>
                  <p className="font-medium truncate">{order.recipientName}</p>
                  <p className="text-[10px] opacity-75 truncate">{order.recipientAddress}, {order.recipientCommune}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center z-10 border-t border-slate-800 pt-3 text-xs text-slate-400">
            <span>Ruta optimizada automáticamente por FlowEx Router Engine</span>
            <button onClick={() => navigate('/driver/daily')} className="text-flow-secondary font-bold hover:underline">
              Abrir Vista Terreno Driver $\rightarrow$
            </button>
          </div>

        </div>

        {/* Dispatch Checklist Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-headline font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-flow-secondary" /> Manifiesto de Carga
          </h3>

          <div className="space-y-3">
            {orders.map((order, idx) => (
              <div key={order.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-flow-primary">#{idx + 1} - {order.trackingNumber}</span>
                  <span className="text-[10px] text-slate-500">{order.zone}</span>
                </div>
                <div className="font-bold text-slate-900">{order.recipientName}</div>
                <div className="text-slate-600 text-[11px]">{order.recipientAddress}, {order.recipientCommune}</div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-slate-500 font-mono"><Phone className="w-3 h-3 inline mr-1" />{order.recipientPhone}</span>
                  <span className={`font-bold ${order.status === 'delivered' ? 'text-emerald-600' : 'text-flow-secondary'}`}>
                    {order.status === 'delivered' ? 'Entregado' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
