import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Phone, 
  MapPin, 
  Mail, 
  PackageCheck
} from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const DailyRoutePage: React.FC = () => {
  const currentDriverEmail = localStorage.getItem('flowex_user_email') || 'rgomez@flowex.cl';
  
  // Requerimiento 6: Ruta del día generada automáticamente (Pagados + Pendientes)
  const [driverOrders, setDriverOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'pending_route' | 'delivered'>('pending_route');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const activeDriverOrders = driverOrders.filter(o => {
    if (activeTab === 'pending_route') {
      return o.status === 'paid' || o.status === 'pending' || o.status === 'transit';
    }
    return o.status === 'delivered' || o.status === 'incident';
  });

  // Requerimiento 7 & 11: Cambio de estado en terreno + Notificación automática por correo
  const handleDriverStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = driverOrders.map(o => {
      if (o.id === orderId) {
        const actionText = newStatus === 'transit' ? 'En Camino' : newStatus === 'delivered' ? 'Entregado' : 'No Entregado / Incidencia';
        
        const newLog = {
          id: `EV-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: currentDriverEmail,
          role: 'driver' as const,
          action: `Cambio de Estado en Terreno: ${actionText}`,
          details: `Actualizado por conductor en terreno.`
        };

        const triggerEvent = newStatus === 'transit' ? 'in_transit' : newStatus === 'delivered' ? 'delivered' : 'failed';
        const emailSubject = newStatus === 'transit' 
          ? `FlowEx: Tu envío ${o.trackingNumber} va en camino`
          : newStatus === 'delivered'
          ? `FlowEx: Tu envío ${o.trackingNumber} ha sido entregado exitosamente`
          : `FlowEx: Intento de entrega no completado para ${o.trackingNumber}`;

        const newEmail = {
          id: `EM-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientEmail: o.recipientEmail,
          triggerEvent: triggerEvent as any,
          subject: emailSubject,
          body: `Hola ${o.recipientName}, notificamos que tu paquete cambió de estado a ${actionText}.`,
          sent: true
        };

        setNotificationToast(`✉️ Correo automático enviado a ${o.recipientEmail} (${emailSubject})`);
        setTimeout(() => setNotificationToast(null), 4500);

        return {
          ...o,
          status: newStatus,
          eventLogs: [newLog, ...o.eventLogs],
          emailNotifications: [newEmail, ...o.emailNotifications]
        };
      }
      return o;
    });

    setDriverOrders(updatedOrders);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 6, title: 'Ruta del Día Automática (Pagados + Pendientes)' },
          { num: 7, title: 'Cambio de Estado Directo en Terreno (Vista Simple)' },
          { num: 11, title: 'Disparo Automático de Notificaciones por Correo' }
        ]}
      />

      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-pulse">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-white" />
            <span>{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)} className="font-bold text-white">✕</button>
        </div>
      )}

      {/* Driver Simple Header (Requerimiento 6 & 7) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-headline font-bold text-slate-900 mt-1">
              Ruta del Día (Vista Conductor)
            </h1>
            <p className="text-xs text-slate-600">
              Conductor: <span className="font-semibold text-slate-900">{currentDriverEmail}</span> | Generada automáticamente.
            </p>
          </div>
          <div className="w-10 h-10 bg-orange-100 text-flow-secondary rounded-xl flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 pt-2 text-xs border-t border-slate-100">
          <button
            onClick={() => setActiveTab('pending_route')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'pending_route'
                ? 'bg-flow-secondary text-white shadow'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Pendientes del Día ({driverOrders.filter(o => o.status === 'paid' || o.status === 'pending' || o.status === 'transit').length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'delivered'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Finalizados ({driverOrders.filter(o => o.status === 'delivered' || o.status === 'incident').length})
          </button>
        </div>
      </div>

      {/* Orders List (Vista Simple Terreno) */}
      <div className="space-y-4">
        {activeDriverOrders.map((order, idx) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-flow-primary font-mono bg-blue-50 px-2 py-0.5 rounded">
                  Parada #{idx + 1} • {order.trackingNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{order.recipientName}</h3>
              </div>
              <StatusBadge status={order.status} size="sm" />
            </div>

            <div className="text-xs space-y-1.5 text-slate-700">
              <p className="flex items-center font-medium text-slate-900">
                <MapPin className="w-4 h-4 mr-1.5 text-flow-secondary flex-shrink-0" />
                {order.recipientAddress}, <span className="font-bold text-flow-primary ml-1">{order.recipientCommune}</span>
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span><Phone className="w-3.5 h-3.5 inline mr-1" />{order.recipientPhone}</span>
                <span>Bultos: <strong className="text-slate-800">{order.packagesCount}</strong></span>
                <span>Zona: <strong className="text-flow-primary">{order.zone}</strong></span>
              </div>
              {order.notes && (
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg text-[11px] border border-amber-200 font-medium">
                  Nota: {order.notes}
                </div>
              )}
            </div>

            {/* Requerimiento 7: Cambio de estado directo en terreno (Vista simple) */}
            {order.status !== 'delivered' && (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDriverStatusUpdate(order.id, 'transit')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    order.status === 'transit'
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  En Camino
                </button>

                <button
                  onClick={() => handleDriverStatusUpdate(order.id, 'delivered')}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Entregado
                </button>

                <button
                  onClick={() => handleDriverStatusUpdate(order.id, 'incident')}
                  className="py-2 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> No Entregado
                </button>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200 flex items-center justify-center space-x-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Entrega Confirmada en Terreno</span>
              </div>
            )}

          </div>
        ))}

        {activeDriverOrders.length === 0 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No hay pedidos en esta sección.
          </div>
        )}
      </div>

    </div>
  );
};
