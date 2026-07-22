import React, { useRef, useState } from 'react';
import {
  Truck,
  CheckCircle,
  XCircle,
  PackageCheck,
  MessageCircle,
  Camera,
  ImagePlus,
  X,
  Building2,
  Package
} from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const DailyRoutePage: React.FC = () => {
  const currentDriverEmail = localStorage.getItem('flowex_user_email') || 'rgomez@flowex.cl';

  const [driverOrders, setDriverOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'pickup_route' | 'delivery_route' | 'delivered'>('pickup_route');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  
  // Photo Modals State
  const [photoModalConfig, setPhotoModalConfig] = useState<{
    order: Order;
    type: 'pickup' | 'delivery';
  } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pickupNotesInput, setPickupNotesInput] = useState<string>('Paquete en buen estado, sin daños externos.');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter logic
  const pickupOrders = driverOrders.filter(o => o.status === 'paid' || o.status === 'pickup_assigned' || o.status === 'picked_up');
  const deliveryOrders = driverOrders.filter(o => o.status === 'in_hub' || o.status === 'transit');
  const finishedOrders = driverOrders.filter(o => o.status === 'delivered' || o.status === 'incident');

  const activeOrders = activeTab === 'pickup_route' ? pickupOrders : activeTab === 'delivery_route' ? deliveryOrders : finishedOrders;

  const handleDriverStatusUpdate = (orderId: string, newStatus: OrderStatus, photoUrl?: string, notes?: string) => {
    const updatedOrders = driverOrders.map(o => {
      if (o.id === orderId) {
        let actionText = '';
        let triggerEvent: any = 'in_transit';

        if (newStatus === 'picked_up') {
          actionText = 'Recogida Realizada en Origen (Foto de Recepción Adjunta)';
          triggerEvent = 'pickup';
        } else if (newStatus === 'in_hub') {
          actionText = 'Ingresado en Centro de Distribución (Hub Pudahuel)';
          triggerEvent = 'hub_reception';
        } else if (newStatus === 'transit') {
          actionText = 'Salida a Ruta de Reparto Final';
          triggerEvent = 'in_transit';
        } else if (newStatus === 'delivered') {
          actionText = 'Entregado a Destinatario Final';
          triggerEvent = 'delivered';
        } else if (newStatus === 'incident') {
          actionText = 'No Entregado / Incidencia';
          triggerEvent = 'failed';
        }

        const newLog = {
          id: `EV-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: currentDriverEmail,
          role: 'driver' as const,
          action: actionText,
          details: notes 
            ? `Nota conductor: ${notes}`
            : photoUrl
            ? 'Estado actualizado con foto de respaldo adjunta.'
            : 'Actualizado desde consola móvil de terreno.'
        };

        const waText = `¡Hola ${o.recipientName}! Tu paquete FlowEx ${o.trackingNumber} actualizó su estado a: ${actionText}. Trazabilidad: https://flowex-front.vercel.app/tracking?code=${o.trackingNumber}`;
        const cleanPhone = o.recipientPhone.replace(/[^0-9]/g, '');
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;

        const newEmail = {
          id: `EM-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientEmail: o.recipientEmail,
          triggerEvent,
          subject: `FlowEx: Novedad en tu pedido ${o.trackingNumber}`,
          body: `Hola ${o.recipientName}, notificamos que tu paquete cambió de estado a "${actionText}".`,
          sent: true
        };

        const newWhatsApp = {
          id: `WA-DRV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientPhone: o.recipientPhone,
          triggerEvent,
          message: waText,
          sent: true,
          whatsappUrl: waUrl
        };

        setNotificationToast(`✉️ Email + 💬 WhatsApp preparado para ${o.recipientPhone}`);
        setTimeout(() => setNotificationToast(null), 4500);

        return {
          ...o,
          status: newStatus,
          pickupPhotoUrl: newStatus === 'picked_up' ? (photoUrl || o.pickupPhotoUrl) : o.pickupPhotoUrl,
          pickupNotes: newStatus === 'picked_up' ? (notes || o.pickupNotes) : o.pickupNotes,
          pickedUpAt: newStatus === 'picked_up' ? new Date().toLocaleString() : o.pickedUpAt,
          hubReceptionAt: newStatus === 'in_hub' ? new Date().toLocaleString() : o.hubReceptionAt,
          deliveryPhotoUrl: newStatus === 'delivered' ? (photoUrl || o.deliveryPhotoUrl) : o.deliveryPhotoUrl,
          eventLogs: [newLog, ...o.eventLogs],
          emailNotifications: [newEmail, ...o.emailNotifications],
          whatsappNotifications: [newWhatsApp, ...(o.whatsappNotifications || [])]
        };
      }
      return o;
    });

    setDriverOrders(updatedOrders);
  };

  const openPhotoModal = (order: Order, type: 'pickup' | 'delivery') => {
    setPhotoPreview(null);
    setPickupNotesInput(type === 'pickup' ? 'Caja en buen estado, sin aperturas.' : '');
    setPhotoModalConfig({ order, type });
  };

  const closePhotoModal = () => {
    setPhotoModalConfig(null);
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

  const confirmPhotoAction = () => {
    if (!photoModalConfig || !photoPreview) return;
    const { order, type } = photoModalConfig;
    if (type === 'pickup') {
      handleDriverStatusUpdate(order.id, 'picked_up', photoPreview, pickupNotesInput);
    } else {
      handleDriverStatusUpdate(order.id, 'delivered', photoPreview);
    }
    closePhotoModal();
  };

  const handleOpenWhatsApp = (order: Order) => {
    const actionText = order.status === 'picked_up' ? 'Recogido en Origen' : order.status === 'transit' ? 'En Reparto Final' : 'En Proceso';
    const waText = `¡Hola ${order.recipientName}! Tu envío FlowEx ${order.trackingNumber} estado actual: ${actionText}. Trazabilidad: https://flowex-front.vercel.app/tracking?code=${order.trackingNumber}`;
    const cleanPhone = order.recipientPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 6, title: 'Generación Automática de Ruta Diaria (Recogida & Entrega)' },
          { num: 7, title: 'Captura de Foto en Recogida (Origen) & Entrega Final' },
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-flow-secondary bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              Módulo de Conductor en Terreno
            </span>
            <h1 className="text-xl font-headline font-bold text-slate-900 mt-1">
              Ruta del Día (Recogidas & Repartos)
            </h1>
            <p className="text-xs text-slate-600">
              Conductor: <span className="font-semibold text-slate-900">{currentDriverEmail}</span> | Flujo: Recogida $\rightarrow$ Foto Origen $\rightarrow$ Hub CD $\rightarrow$ Entrega Final.
            </p>
          </div>
          <div className="w-10 h-10 bg-orange-100 text-flow-secondary rounded-xl flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Tab Selection: Pickups vs Deliveries vs Finished */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-100">
          <button
            onClick={() => setActiveTab('pickup_route')}
            className={`py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center ${
              activeTab === 'pickup_route'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <PackageCheck className="w-4 h-4 mr-1.5" />
            1. Recogidas ({pickupOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('delivery_route')}
            className={`py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center ${
              activeTab === 'delivery_route'
                ? 'bg-flow-primary text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4 mr-1.5" />
            2. Repartos ({deliveryOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('delivered')}
            className={`py-2.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center ${
              activeTab === 'delivered'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Finalizados ({finishedOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {activeOrders.map((order, idx) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-flow-primary font-mono bg-blue-50 px-2 py-0.5 rounded">
                  Parada #{idx + 1} • {order.trackingNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeTab === 'pickup_route' ? `Retiro: ${order.senderName}` : `Entrega: ${order.recipientName}`}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={order.status} size="sm" />
                <button
                  onClick={() => handleOpenWhatsApp(order)}
                  title="Enviar Notificación por WhatsApp"
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors flex items-center text-[10px] font-bold"
                >
                  <MessageCircle className="w-4 h-4 mr-1 text-emerald-600" /> WhatsApp
                </button>
              </div>
            </div>

            {/* Address Details */}
            <div className="text-xs space-y-2 text-slate-700">
              {activeTab === 'pickup_route' ? (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                  <span className="text-[10px] text-purple-700 font-bold uppercase block">📍 Dirección de Recogida (Remitente Origen)</span>
                  <p className="font-bold text-slate-900">{order.senderAddress}, {order.senderCommune}</p>
                  <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                    <span>Contacto: <strong>{order.senderName}</strong> ({order.senderPhone})</span>
                    <span>Bultos a retirar: <strong className="text-purple-700 font-bold">{order.packagesCount}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <span className="text-[10px] text-flow-primary font-bold uppercase block">🎯 Dirección de Entrega (Destinatario Final)</span>
                  <p className="font-bold text-slate-900">{order.recipientAddress}, {order.recipientCommune}</p>
                  <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                    <span>Destinatario: <strong>{order.recipientName}</strong> ({order.recipientPhone})</span>
                    <span>Zona: <strong className="text-flow-primary">{order.zone}</strong></span>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="p-2 bg-amber-50 text-amber-800 rounded-lg text-[11px] border border-amber-200 font-medium">
                  Nota del pedido: {order.notes}
                </div>
              )}
            </div>

            {/* Pickup Evidence Thumbnail if exists */}
            {order.pickupPhotoUrl && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs flex items-center space-x-3">
                <img
                  src={order.pickupPhotoUrl}
                  alt="Foto recogida"
                  className="w-14 h-14 object-cover rounded-lg border border-purple-300"
                />
                <div>
                  <span className="font-bold text-purple-900 text-[11px] block">✓ Foto de Recogida Registrada en Origen</span>
                  <p className="text-[11px] text-purple-700 italic">"{order.pickupNotes || 'Recibido sin observaciones.'}"</p>
                  <span className="text-[10px] text-slate-500">{order.pickedUpAt}</span>
                </div>
              </div>
            )}

            {/* Actions for Pickup Tab */}
            {activeTab === 'pickup_route' && (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                {order.status !== 'picked_up' ? (
                  <button
                    onClick={() => openPhotoModal(order, 'pickup')}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center"
                  >
                    <Camera className="w-4 h-4 mr-1.5" /> Tomar Foto & Confirmar Recogida
                  </button>
                ) : (
                  <button
                    onClick={() => handleDriverStatusUpdate(order.id, 'in_hub')}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center"
                  >
                    <Building2 className="w-4 h-4 mr-1.5" /> Entregar en Centro de Distribución (Hub Pudahuel)
                  </button>
                )}
              </div>
            )}

            {/* Actions for Delivery Tab */}
            {activeTab === 'delivery_route' && (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDriverStatusUpdate(order.id, 'transit')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    order.status === 'transit'
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  En Reparto Final
                </button>

                <button
                  onClick={() => openPhotoModal(order, 'delivery')}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Entregado
                </button>

                <button
                  onClick={() => handleDriverStatusUpdate(order.id, 'incident')}
                  className="py-2 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Incidencia
                </button>
              </div>
            )}

            {/* Delivery Details if Finished */}
            {activeTab === 'delivered' && order.status === 'delivered' && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center">
                    <PackageCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> Entrega Final Confirmada
                  </span>
                  {order.deliveryPhotoUrl && <span className="text-[10px] text-emerald-700">Evidencia Adjunta</span>}
                </div>
                {order.deliveryPhotoUrl && (
                  <div className="flex items-center justify-center pt-1">
                    <img
                      src={order.deliveryPhotoUrl}
                      alt={`Foto de entrega ${order.trackingNumber}`}
                      className="h-24 w-24 object-cover rounded-lg border border-emerald-300 shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

          </div>
        ))}

        {activeOrders.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No hay pedidos registrados en esta sección.</p>
          </div>
        )}
      </div>

      {/* Proof Photo Modal (Used for both Pickup Photo and Delivery Photo) */}
      {photoModalConfig && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className={`w-5 h-5 ${photoModalConfig.type === 'pickup' ? 'text-purple-600' : 'text-emerald-600'}`} />
                <h3 className="font-headline font-bold text-slate-900 text-base">
                  {photoModalConfig.type === 'pickup' ? 'Foto de Recepción en Origen (Recogida)' : 'Confirmar Entrega con Foto'}
                </h3>
              </div>
              <button onClick={closePhotoModal} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Guía:</span> <span className="font-mono font-bold text-flow-primary">{photoModalConfig.order.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{photoModalConfig.type === 'pickup' ? 'Remitente:' : 'Destinatario:'}</span>
                <span className="font-semibold">{photoModalConfig.type === 'pickup' ? photoModalConfig.order.senderName : photoModalConfig.order.recipientName}</span>
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
                  alt="Vista previa de foto"
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
                className={`w-full h-40 flex flex-col items-center justify-center space-y-2 border-2 border-dashed rounded-xl transition-colors ${
                  photoModalConfig.type === 'pickup'
                    ? 'border-purple-300 text-purple-600 hover:bg-purple-50/50'
                    : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50/50'
                }`}
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-xs font-semibold">
                  {photoModalConfig.type === 'pickup'
                    ? 'Tomar Foto de cómo recibiste el paquete del cliente'
                    : 'Tomar Foto de respaldo de entrega'}
                </span>
              </button>
            )}

            {photoModalConfig.type === 'pickup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observación de Recepción</label>
                <input
                  type="text"
                  value={pickupNotesInput}
                  onChange={(e) => setPickupNotesInput(e.target.value)}
                  placeholder="Ej: Embalaje sellado, sin abolladuras"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={confirmPhotoAction}
                disabled={!photoPreview}
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  photoModalConfig.type === 'pickup' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {photoModalConfig.type === 'pickup' ? 'Confirmar Recogida Con Foto' : 'Confirmar Entrega Final'}
              </button>
              <button
                onClick={closePhotoModal}
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
