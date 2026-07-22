import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Mail, CheckCircle2, History, MessageCircle, ExternalLink } from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || 'FX-9842-8812-CL';
  const [inputCode, setInputCode] = useState(initialCode);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    const found = mockOrders.find(o => o.trackingNumber.toLowerCase() === initialCode.toLowerCase());
    if (found) {
      setCurrentOrder(found);
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

  const handleOpenWhatsAppWeb = () => {
    if (!currentOrder) return;
    const waText = `Hola ${currentOrder.recipientName}, revisa el estado en vivo de tu envío FlowEx ${currentOrder.trackingNumber} aquí: https://flowex-front.vercel.app/tracking?code=${currentOrder.trackingNumber}`;
    const cleanPhone = currentOrder.recipientPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 10, title: 'Vista Externa Pública de Seguimiento (Log como Fuente de Verdad)' },
          { num: 11, title: 'Notificaciones Automáticas por Correo & WhatsApp' }
        ]}
      />

      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-flow-primary to-blue-900 text-white p-8 rounded-3xl shadow-flow text-center space-y-4 relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl font-headline font-extrabold">Seguimiento de Envío FlowEx</h1>
          <p className="text-xs text-blue-200">
            Consulta el estado de tu paquete sin necesidad de iniciar sesión. Log de eventos en vivo como fuente de verdad.
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
              Consultar
            </button>
          </div>
        </form>
      </div>

      {currentOrder && (
        <div className="space-y-6">
          
          {/* Status & Package Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-[11px] font-mono text-slate-500 font-bold">Nº DE GUÍA DE SEGUIMIENTO</span>
                <h2 className="text-2xl font-headline font-extrabold text-flow-primary font-mono">
                  {currentOrder.trackingNumber}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={currentOrder.status} size="lg" />
                <button
                  onClick={handleOpenWhatsAppWeb}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow flex items-center transition-all"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" /> Enviar Estado por WhatsApp
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 font-medium uppercase text-[10px] block mb-1">Destinatario</span>
                <p className="font-bold text-slate-900">{currentOrder.recipientName}</p>
                <p className="text-slate-600">{currentOrder.recipientAddress}</p>
                <p className="text-slate-500 font-semibold">{currentOrder.recipientCommune} ({currentOrder.recipientPhone})</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 font-medium uppercase text-[10px] block mb-1">Carga & Seguro</span>
                <p className="font-semibold text-slate-800">{currentOrder.packagesCount} bulto(s) ({currentOrder.packageType})</p>
                <p className="text-slate-500">Valor Declarado: ${currentOrder.declaredValue.toLocaleString()} CLP</p>
                <p className="text-emerald-700 font-semibold mt-0.5">Seguro Cubierto: ${currentOrder.insuranceCost.toLocaleString()} CLP</p>
                {currentOrder.promoCode && (
                  <span className="inline-block mt-1 text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                    🏷️ Código Promo: {currentOrder.promoCode} (-${currentOrder.discountAmount?.toLocaleString()} CLP)
                  </span>
                )}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-400 font-medium uppercase text-[10px] block mb-1">Logística & Hub CD</span>
                <p className="font-bold text-flow-primary">
                  {currentOrder.hubName || 'Hub Central Pudahuel'}
                </p>
                <p className="text-slate-500 text-[11px] mt-1">Conductor: <span className="font-semibold text-slate-800">{currentOrder.assignedDriverName || currentOrder.pickupDriverName || 'Asignación en proceso'}</span></p>
                {currentOrder.pickupPhotoUrl && (
                  <div className="mt-2 flex items-center space-x-2 bg-purple-50 p-1.5 rounded-lg border border-purple-200">
                    <img src={currentOrder.pickupPhotoUrl} alt="Foto Recogida" className="w-10 h-10 object-cover rounded border border-purple-300" />
                    <span className="text-[10px] text-purple-800 font-bold">✓ Foto de Recogida Registrada en Origen</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requerimiento 10: Event Log as Single Source of Truth */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider flex items-center">
                <History className="w-4 h-4 mr-2 text-flow-secondary" /> Trazabilidad en Vivo (Fuente de Verdad Log de Eventos)
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                Sincronizado
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentOrder.eventLogs.map((log, idx) => (
                <div key={log.id || idx} className="relative group">
                  
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 bg-flow-primary border-flow-primary text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-900 font-headline text-xs">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60 flex justify-between">
                      <span>Registrado por: {log.user}</span>
                      <span className="uppercase font-bold text-flow-secondary">[{log.role}]</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Notifications History Grid (Email & WhatsApp) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-headline font-bold text-flow-primary uppercase tracking-wider flex items-center border-b border-slate-100 pb-3">
                <Mail className="w-4 h-4 mr-2 text-flow-secondary" /> Notificaciones por Correo
              </h3>

              <div className="space-y-3">
                {currentOrder.emailNotifications.map(email => (
                  <div key={email.id} className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-flow-primary">
                      <span>Enviado a: {email.recipientEmail}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{email.timestamp}</span>
                    </div>
                    <div className="font-bold text-slate-900">{email.subject}</div>
                    <p className="text-slate-600 text-[11px]">{email.body}</p>
                  </div>
                ))}
                {currentOrder.emailNotifications.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No hay notificaciones por correo.</p>
                )}
              </div>
            </div>

            {/* WhatsApp Notifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-headline font-bold text-emerald-800 uppercase tracking-wider flex items-center border-b border-slate-100 pb-3">
                <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" /> Notificaciones por WhatsApp
              </h3>

              <div className="space-y-3">
                {(currentOrder.whatsappNotifications || []).map(wa => (
                  <div key={wa.id} className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-emerald-800">
                      <span>WhatsApp enviado a: {wa.recipientPhone}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{wa.timestamp}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{wa.message}</p>
                    {wa.whatsappUrl && (
                      <a
                        href={wa.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-emerald-700 hover:underline inline-flex items-center pt-1"
                      >
                        Abrir Chat de WhatsApp <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                ))}
                {(!currentOrder.whatsappNotifications || currentOrder.whatsappNotifications.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400 italic mb-2">No se han registrado envíos de WhatsApp.</p>
                    <button
                      onClick={handleOpenWhatsAppWeb}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow inline-flex items-center"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" /> Enviar Primer WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
