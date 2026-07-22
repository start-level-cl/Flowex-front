import React, { useRef, useState } from 'react';
import {
  Truck,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  PackageCheck,
  MessageCircle,
  Camera,
  ImagePlus,
  X
} from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const DailyRoutePage: React.FC = () => {
  const currentDriverEmail = localStorage.getItem('flowex_user_email') || 'rgomez@flowex.cl';

  const [driverOrders, setDriverOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'pending_route' | 'delivered'>('pending_route');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [deliveryPhotoOrder, setDeliveryPhotoOrder] = useState<Order | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDriverOrders = driverOrders.filter(o => {
    if (activeTab === 'pending_route') {
      return o.status === 'paid' || o.status === 'pending' || o.status === 'transit';
    }
    return o.status === 'delivered' || o.status === 'incident';
  });

  const handleDriverStatusUpdate = (orderId: string, newStatus: OrderStatus, photoUrl?: string) => {
    const updatedOrders = driverOrders.map(o => {
      if (o.id === orderId) {
        const actionText = newStatus === 'transit' ? 'En Camino' : newStatus === 'delivered' ? 'Entregado' : 'No Entregado / Incidencia';

        const newLog = {
          id: `EV-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: currentDriverEmail,
          role: 'driver' as const,
          action: `Cambio de Estado en Terreno: ${actionText}`,
          details: photoUrl
            ? 'Entrega confirmada por conductor en terreno con foto de respaldo adjunta.'
            : 'Actualizado por conductor en terreno.'
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

        const waText = `¡Hola ${o.recipientName}! Tu paquete FlowEx ${o.trackingNumber} ha cambiado a estado: ${actionText}. Sigue la trazabilidad en vivo: https://flowex-front.vercel.app/tracking?code=${o.trackingNumber}`;
        const cleanPhone = o.recipientPhone.replace(/[^0-9]/g, '');
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;

        const newWhatsApp = {
          id: `WA-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientPhone: o.recipientPhone,
          triggerEvent: triggerEvent as any,
          message: waText,
          sent: true,
          whatsappUrl: waUrl
        };

        setNotificationToast(`✉️ Email + 💬 WhatsApp preparado para ${o.recipientPhone}`);
        setTimeout(() => setNotificationToast(null), 4500);

        return {
          ...o,
          status: newStatus,
          deliveryPhotoUrl: photoUrl || o.deliveryPhotoUrl,
          eventLogs: [newLog, ...o.eventLogs],
          emailNotifications: [newEmail, ...o.emailNotifications],
          whatsappNotifications: [newWhatsApp, ...(o.whatsappNotifications || [])]
        };
      }
      return o;
    });

    setDriverOrders(updatedOrders);
  };

  const openDeliveryPhotoModal = (order: Order) => {
    setPhotoPreview(null);
    setDeliveryPhotoOrder(order);
  };

  const closeDeliveryPhotoModal = () => {
    setDeliveryPhotoOrder(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const confirmDeliveryWithPhoto = () => {
    if (!deliveryPhotoOrder || !photoPreview) return;
    handleDriverStatusUpdate(deliveryPhotoOrder.id, 'delivered', photoPreview);
    closeDeliveryPhotoModal();
  };

  const handleOpenWhatsApp = (order: Order) => {
    const actionText = order.status === 'transit' ? 'En Camino' : order.status === 'delivered' ? 'Entregado' : 'Registrado';
    const waText = `¡Hola ${order.recipientName}! Tu envío FlowEx ${order.trackingNumber} estado: ${actionText}. Trazabilidad: https://flowex-front.vercel.app/tracking?code=${order.trackingNumber}`;
    const cleanPhone = order.recipientPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 6, title: 'Ruta del Día Automática (Pagados + Pendientes)' },
          { num: 7, title: 'Cambio de Estado Directo en Terreno (Vista Simple)' },
          { num: 11, title: 'Notificaciones Automáticas por Correo & WhatsApp' }
        ]}
      />

      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-pulse">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-emerald-200" />
            <span>{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)} className="font-bold text-white">✕</button>
        </div>
      )}

      {/* Driver Simple Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-headline font-bold text-slate-900 mt-1">
              Ruta del Día (Vista Conductor)
            </h1>
            <p className="text-xs text-slate-600">
              Conductor: <span className="font-semibold text-slate-900">{currentDriverEmail}</span> | Notificaciones por WhatsApp integradas.
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

      {/* Orders List */}
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
              <div className="flex items-center space-x-2">
                <StatusBadge status={order.status} size="sm" />
                <button
                  onClick={() => handleOpenWhatsApp(order)}
                  title="Enviar Notificación por WhatsApp Web"
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors flex items-center text-[10px] font-bold"
                >
                  <MessageCircle className="w-4 h-4 mr-1 text-emerald-600" /> WhatsApp
                </button>
              </div>
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

            {/* Change Status in Terrain */}
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
                  onClick={() => openDeliveryPhotoModal(order)}
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
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-xs font-bold">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  <span>Entrega Confirmada en Terreno</span>
                </div>
                {order.deliveryPhotoUrl && (
                  <div className="flex items-center justify-center">
                    <img
                      src={order.deliveryPhotoUrl}
                      alt={`Foto de entrega ${order.trackingNumber}`}
                      className="h-20 w-20 object-cover rounded-lg border border-emerald-300 shadow-sm"
                    />
                  </div>
                )}
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

      {/* Proof of Delivery Photo Modal */}
      {deliveryPhotoOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="font-headline font-bold text-slate-900 text-base">Confirmar Entrega con Foto</h3>
              </div>
              <button onClick={closeDeliveryPhotoModal} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Guía:</span> <span className="font-mono font-bold text-flow-primary">{deliveryPhotoOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Destinatario:</span> <span className="font-semibold">{deliveryPhotoOrder.recipientName}</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelected}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Vista previa de entrega"
                  className="w-full h-56 object-cover rounded-xl border border-slate-200"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-700 text-[11px] font-bold rounded-lg shadow border border-slate-200"
                >
                  Cambiar Foto
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-xs font-semibold">Tomar Foto o Subir Evidencia de Entrega</span>
              </button>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              La foto queda adjunta como respaldo de entrega en el registro del pedido.
            </p>

            <div className="space-y-2">
              <button
                onClick={confirmDeliveryWithPhoto}
                disabled={!photoPreview}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow flex items-center justify-center transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Entrega
              </button>
              <button
                onClick={closeDeliveryPhotoModal}
                className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium text-xs text-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
