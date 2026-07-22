import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Navigation, Phone, ArrowRight, PackageCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order } from '../../types';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const RouteDispatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(mockOrders);
  const [routeMode, setRouteMode] = useState<'pickups' | 'deliveries'>('pickups');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedNotice, setOptimizedNotice] = useState<string | null>(null);

  const routeDriverName = 'Roberto Gómez';
  const vehiclePlate = 'KJL-942 (Furgón Mercedes Sprinter)';
  const hubName = 'Hub Central Pudahuel';

  const pickupOrders = orders.filter(o => o.status === 'paid' || o.status === 'pickup_assigned' || o.status === 'picked_up');
  const deliveryOrders = orders.filter(o => o.status === 'in_hub' || o.status === 'transit' || o.status === 'delivered');

  const activeOrders = routeMode === 'pickups' ? pickupOrders : deliveryOrders;

  const handleGenerateRoute = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizedNotice(
        routeMode === 'pickups'
          ? `¡Ruta de Recogida generada exitosamente! ${pickupOrders.length} puntos de origen secuenciados hacia ${hubName}.`
          : `¡Ruta de Reparto Final generada exitosamente! ${deliveryOrders.length} destinos secuenciados por zonificación.`
      );
      setTimeout(() => setOptimizedNotice(null), 5000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 4, title: 'Zonificación Automática Asignada al Driver' },
          { num: 6, title: 'Generación Automática de Ruta de Recogida & Reparto' }
        ]}
      />

      {/* Driver Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-flow-secondary uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            Consola de Enrutamiento & Despacho
          </span>
          <h1 className="text-2xl font-headline font-bold text-slate-900 mt-1">
            Generador de Rutas (Recogidas & Entregas)
          </h1>
          <p className="text-xs text-slate-600">
            Conductor: <span className="font-semibold text-slate-900">{routeDriverName}</span> | Vehículo: <span className="font-mono text-slate-800">{vehiclePlate}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateRoute}
            disabled={isOptimizing}
            className="flex items-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizando...' : 'Generar Ruta Óptima'}
          </button>

          <button
            onClick={() => navigate('/driver/daily')}
            className="flex items-center px-4 py-2.5 bg-flow-secondary hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            Ir a Vista Terreno Driver <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Toast alert */}
      {optimizedNotice && (
        <div className="bg-purple-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-pulse">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-purple-300" />
            <span>{optimizedNotice}</span>
          </div>
          <button onClick={() => setOptimizedNotice(null)} className="font-bold text-white">✕</button>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        <button
          onClick={() => setRouteMode('pickups')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center ${
            routeMode === 'pickups'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PackageCheck className="w-4 h-4 mr-1.5" />
          Ruta de Recogida (Origins)
        </button>

        <button
          onClick={() => setRouteMode('deliveries')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center ${
            routeMode === 'deliveries'
              ? 'bg-flow-primary text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4 mr-1.5" />
          Ruta de Reparto (Destinations)
        </button>
      </div>

      {/* Route Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Centro de Distribución</span>
          <p className="text-xs font-bold text-flow-primary mt-1">{hubName}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {routeMode === 'pickups' ? 'Paradas de Recogida' : 'Paradas de Reparto'}
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeOrders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {routeMode === 'pickups' ? 'Recogidos con Foto' : 'Entregados con Foto'}
          </span>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {routeMode === 'pickups' 
              ? orders.filter(o => o.status === 'picked_up' || o.status === 'in_hub').length
              : orders.filter(o => o.status === 'delivered').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Distancia Estimada</span>
          <p className="text-xl font-bold text-flow-secondary mt-1">
            {routeMode === 'pickups' ? '28.4 km' : '42.5 km'}
          </p>
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
              <span className="text-xs font-semibold">
                GPS Engine: {routeMode === 'pickups' ? 'Secuencia de Recogida en Origen' : 'Secuencia de Entrega Final'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Última optimización: En vivo</span>
          </div>

          {/* Map Stops Visual Trail */}
          <div className="my-8 z-10 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Secuencia Generada ({activeOrders.length} paradas):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeOrders.map((order, idx) => (
                <div key={order.id} className={`p-3 rounded-xl border text-xs ${
                  order.status === 'delivered' || order.status === 'picked_up'
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200' 
                    : order.status === 'transit' || order.status === 'pickup_assigned'
                    ? 'bg-orange-950/80 border-flow-secondary text-orange-100 ring-2 ring-flow-secondary'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}>
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span>Parada #{idx + 1}</span>
                    <span className="text-[10px] uppercase font-mono">{order.status}</span>
                  </div>
                  <p className="font-medium truncate">
                    {routeMode === 'pickups' ? order.senderName : order.recipientName}
                  </p>
                  <p className="text-[10px] opacity-75 truncate">
                    {routeMode === 'pickups' ? `${order.senderAddress}, ${order.senderCommune}` : `${order.recipientAddress}, ${order.recipientCommune}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center z-10 border-t border-slate-800 pt-3 text-xs text-slate-400">
            <span>Algoritmo de Enrutamiento FlowEx Router v2.0 (Origen $\rightarrow$ Hub $\rightarrow$ Destino)</span>
            <button onClick={() => navigate('/driver/daily')} className="text-flow-secondary font-bold hover:underline">
              Ir a Vista Terreno Driver $\rightarrow$
            </button>
          </div>

        </div>

        {/* Dispatch Checklist Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-headline font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center">
            {routeMode === 'pickups' ? (
              <PackageCheck className="w-5 h-5 mr-2 text-purple-600" />
            ) : (
              <Truck className="w-5 h-5 mr-2 text-flow-secondary" />
            )}
            {routeMode === 'pickups' ? 'Manifiesto de Recogidas' : 'Manifiesto de Entregas'}
          </h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {activeOrders.map((order, idx) => (
              <div key={order.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-flow-primary">#{idx + 1} - {order.trackingNumber}</span>
                  <span className="text-[10px] text-slate-500">{order.zone}</span>
                </div>
                <div className="font-bold text-slate-900">
                  {routeMode === 'pickups' ? `Retiro: ${order.senderName}` : `Entrega: ${order.recipientName}`}
                </div>
                <div className="text-slate-600 text-[11px]">
                  {routeMode === 'pickups' ? order.senderAddress : order.recipientAddress}, {routeMode === 'pickups' ? order.senderCommune : order.recipientCommune}
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-slate-500 font-mono"><Phone className="w-3 h-3 inline mr-1" />{routeMode === 'pickups' ? order.senderPhone : order.recipientPhone}</span>
                  <span className={`font-bold ${order.status === 'delivered' || order.status === 'picked_up' ? 'text-emerald-600' : 'text-flow-secondary'}`}>
                    {order.status}
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
