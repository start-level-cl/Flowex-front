import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, CheckCircle2, Clock, Phone } from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || 'FX-9842-8812-CL';
  const [inputCode, setInputCode] = useState(initialCode);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    const found = mockOrders.find(o => o.trackingNumber.toLowerCase() === initialCode.toLowerCase());
    if (found) {
      setCurrentOrder(found);
    } else if (initialCode.startsWith('FX-SMART-')) {
      // Dynamic mock for smart created orders
      setCurrentOrder({
        id: 'ORD-SMART',
        trackingNumber: initialCode,
        senderName: 'Importaciones Santiago S.A.',
        senderPhone: '+56 9 8765 4321',
        senderAddress: 'Av. Providencia 1234',
        senderCity: 'Santiago',
        recipientName: 'Pedro Alvarado',
        recipientPhone: '+56 9 4433 2211',
        recipientAddress: 'Calle 1 Norte 1240',
        recipientCity: 'Viña del Mar',
        packageType: 'Caja Repuestos Automotrices',
        weightKg: 6.2,
        declaredValue: 350000,
        status: 'transit',
        createdAt: 'Hoy 10:30 AM',
        estimatedDelivery: 'Mañana 14:00 PM',
        currentLocation: 'Hub Costa Viña',
        hubOrigin: 'Hub Central Santiago',
        hubDestination: 'Hub Costa Viña',
        totalCost: 16800,
        timeline: [
          { title: 'Pedido Creado con IA FlowEx', timestamp: 'Hoy 10:30 AM', location: 'Santiago HQ', completed: true },
          { title: 'En Tránsito Interurbano', timestamp: 'Hoy 11:15 AM', location: 'Ruta 68', completed: true },
          { title: 'Llegada a Hub Destino', timestamp: 'En Proceso', location: 'Hub Costa Viña', completed: false }
        ]
      });
    } else {
      setCurrentOrder(mockOrders[0]);
    }
  }, [initialCode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setSearchParams({ code: inputCode.trim() });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-flow-primary to-blue-900 text-white p-8 rounded-3xl shadow-flow text-center space-y-4 relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono tracking-widest text-flow-secondary uppercase font-bold">
            Portal de Rastreo Público
          </span>
          <h1 className="text-3xl font-headline font-extrabold">Rastrea tu Envío FlowEx</h1>
          <p className="text-xs text-blue-200">
            Ingresa tu número de guía de despacho para consultar el estado en tiempo real.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative pt-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ej: FX-9842-8812-CL"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full text-sm py-3 pl-10 pr-24 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-mono font-bold focus:outline-none focus:ring-4 focus:ring-flow-secondary shadow-lg"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3" />
            <button
              type="submit"
              className="absolute right-1.5 py-2 px-4 bg-flow-secondary hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Rastrear
            </button>
          </div>
        </form>
      </div>

      {currentOrder && (
        <div className="space-y-6">
          
          {/* Status & Package Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[11px] font-mono text-slate-500 font-bold">Nº DE GUÍA DE DESPACHO</span>
                <h2 className="text-2xl font-headline font-extrabold text-flow-primary font-mono">
                  {currentOrder.trackingNumber}
                </h2>
              </div>
              <div>
                <StatusBadge status={currentOrder.status} size="lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 font-medium uppercase text-[10px] block mb-1">Destinatario</span>
                <p className="font-bold text-slate-900">{currentOrder.recipientName}</p>
                <p className="text-slate-600">{currentOrder.recipientAddress}</p>
                <p className="text-slate-500 font-medium">{currentOrder.recipientCity}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 font-medium uppercase text-[10px] block mb-1">Estimación de Entrega</span>
                <p className="font-bold text-emerald-600 text-sm">{currentOrder.estimatedDelivery}</p>
                <p className="text-slate-500 text-[11px] mt-1">Ubicación Actual: <span className="font-semibold text-slate-800">{currentOrder.currentLocation}</span></p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 font-medium uppercase text-[10px] block mb-1">Detalles de Carga</span>
                <p className="font-semibold text-slate-800">{currentOrder.packageType}</p>
                <p className="text-slate-500">Peso: {currentOrder.weightKg} kg</p>
                {currentOrder.assignedDriverName && (
                  <p className="text-flow-primary font-semibold mt-1">Repartidor: {currentOrder.assignedDriverName}</p>
                )}
              </div>
            </div>

          </div>

          {/* Chronological Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-2 text-flow-secondary" /> Cronograma de Hitos del Envío
            </h3>

            <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentOrder.timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Circle Indicator */}
                  <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                  </div>

                  <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className={item.completed ? 'text-slate-900 font-headline' : 'text-slate-500'}>
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                    </div>
                    <div className="flex items-center text-slate-600 text-[11px]">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {item.location}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Support & Contact Footer */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-slate-600">¿Tienes dudas con la entrega de este paquete?</span>
            <div className="flex space-x-2">
              <a href="tel:+56800400800" className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1" /> Soporte Telefónico
              </a>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
