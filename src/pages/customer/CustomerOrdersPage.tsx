import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { mockOrders, mockCustomerProfile } from '../../data/mockData';
import type { Order } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const CustomerOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const customerEmail = localStorage.getItem('flowex_user_email') || mockCustomerProfile.email;

  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid_all'>('unpaid');
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);

  // Filter orders for the logged customer
  const customerOrders = orders.filter(o => o.customerEmail === customerEmail || true);

  const unpaidOrders = customerOrders.filter(o => !o.isPaid);
  const paidOrders = customerOrders.filter(o => o.isPaid);

  const handlePayOrder = (method: 'webpay' | 'credit_card' | 'transfer') => {
    if (!selectedOrderForPayment) return;

    const currentRole = (localStorage.getItem('flowex_user_role') || 'customer') as any;
    const currentEmail = localStorage.getItem('flowex_user_email') || customerEmail;

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderForPayment.id) {
        const txId = `TX-${method.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const paidAtStr = new Date().toLocaleString();

        const payLog = {
          id: `EV-PAY-${Date.now()}`,
          timestamp: paidAtStr,
          user: currentEmail,
          role: currentRole,
          action: 'Pago Exitoso Realizado por Cliente',
          details: `Pago de $${o.totalCost.toLocaleString()} procesado por ${method.toUpperCase()} (${txId}).`
        };

        const payEmail = {
          id: `EM-PAY-${Date.now()}`,
          timestamp: paidAtStr,
          recipientEmail: o.recipientEmail,
          triggerEvent: 'order_created' as const,
          subject: `FlowEx: Pago Aprobado para Envío ${o.trackingNumber}`,
          body: `Hola ${o.recipientName}, confirmamos que el envío ${o.trackingNumber} fue pagado y está listo para despacho.`,
          sent: true
        };

        return {
          ...o,
          isPaid: true,
          status: 'paid' as const,
          paymentMethod: method,
          paymentTransactionId: txId,
          paidAt: paidAtStr,
          eventLogs: [payLog, ...o.eventLogs],
          emailNotifications: [payEmail, ...o.emailNotifications]
        };
      }
      return o;
    }));

    setPaymentSuccessToast(`¡Pago Aprobado! El envío ${selectedOrderForPayment.trackingNumber} cambió a estado Pagado.`);
    setSelectedOrderForPayment(null);
    setTimeout(() => setPaymentSuccessToast(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 2, title: 'Registro y Persistencia de Datos de Cliente' },
          { num: 5, title: 'Pasarela de Pago Integrada (Filtro Envíos Pendientes por Pagar)' }
        ]}
      />

      {/* Toast Notification */}
      {paymentSuccessToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs font-semibold animate-bounce">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{paymentSuccessToast}</span>
          </div>
          <button onClick={() => setPaymentSuccessToast(null)} className="font-bold text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-flow-primary uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Portal del Cliente
          </span>
          <h1 className="text-2xl font-headline font-bold text-slate-900 mt-1">
            Mis Envíos & Pendientes de Pago
          </h1>
          <p className="text-xs text-slate-600">
            Cliente: <span className="font-semibold text-slate-900">{customerEmail}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/customer/create')}
          className="flex items-center px-4 py-2.5 bg-flow-primary hover:bg-blue-900 text-white font-semibold text-xs rounded-xl shadow transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Ingresar Nuevo Pedido
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('unpaid')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-all flex items-center ${
            activeTab === 'unpaid'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 mr-1.5 text-amber-500" />
          Pendientes por Pagar ({unpaidOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('paid_all')}
          className={`pb-2.5 px-4 font-bold border-b-2 transition-all flex items-center ${
            activeTab === 'paid_all'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
          Pagados & En Tránsito ({paidOrders.length})
        </button>
      </div>

      {/* Orders View */}
      {activeTab === 'unpaid' ? (
        <div className="space-y-4">
          {unpaidOrders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border-2 border-amber-200/80 shadow-sm space-y-4 hover:border-amber-400 transition-all">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Número de Guía</span>
                  <h3 className="text-xl font-headline font-bold text-flow-primary font-mono">{order.trackingNumber}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-300 inline-flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Pendiente de Pago
                  </span>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Destinatario</span>
                  <p className="font-bold text-slate-900">{order.recipientName}</p>
                  <p className="text-slate-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1 text-flow-secondary" /> {order.recipientAddress}, {order.recipientCommune}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Detalles de Carga</span>
                  <p className="font-semibold text-slate-800">{order.packagesCount} bulto(s) • {order.packageType}</p>
                  <p className="text-slate-500 mt-1">Zonificación: <span className="font-bold text-flow-primary">{order.zone}</span></p>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-right flex flex-col justify-between">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Total a Pagar</span>
                  <span className="text-2xl font-headline font-extrabold text-flow-secondary font-mono">
                    ${order.totalCost.toLocaleString()} CLP
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => navigate(`/tracking?code=${order.trackingNumber}`)}
                  className="text-xs text-flow-primary font-semibold hover:underline"
                >
                  Ver Trazabilidad $\rightarrow$
                </button>

                <button
                  onClick={() => setSelectedOrderForPayment(order)}
                  className="px-5 py-2.5 bg-gradient-to-r from-flow-secondary to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center transition-all"
                >
                  <CreditCard className="w-4 h-4 mr-2" /> Pagar Ahora (${order.totalCost.toLocaleString()} CLP)
                </button>
              </div>

            </div>
          ))}

          {unpaidOrders.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">¡Al día! No tienes envíos pendientes por pagar</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Todos tus envíos creados han sido pagados y procesados para entrega.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Paid Orders List */
        <div className="space-y-4">
          {paidOrders.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <span className="font-mono font-bold text-flow-primary text-sm">{order.trackingNumber}</span>
                  <span className="text-xs text-slate-500 ml-2">({order.recipientName})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Pagado ({order.paymentMethod})
                  </span>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Comuna Destino: <strong>{order.recipientCommune}</strong> ({order.zone})</span>
                <button
                  onClick={() => navigate(`/tracking?code=${order.trackingNumber}`)}
                  className="text-flow-primary font-bold hover:underline"
                >
                  Ver Rastreo Público <ArrowRight className="w-3.5 h-3.5 inline ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Payment Modal */}
      {selectedOrderForPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-flow-secondary" />
                <h3 className="font-headline font-bold text-slate-900 text-base">Pagar Envío Pendiente</h3>
              </div>
              <button onClick={() => setSelectedOrderForPayment(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Guía:</span> <span className="font-mono font-bold text-flow-primary">{selectedOrderForPayment.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Destinatario:</span> <span className="font-semibold">{selectedOrderForPayment.recipientName}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-2">
                <span>Monto a Pagar:</span>
                <span className="text-flow-secondary font-mono">${selectedOrderForPayment.totalCost.toLocaleString()} CLP</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase">Selecciona el método de pago:</span>
              <button
                onClick={() => handlePayOrder('webpay')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center transition-colors"
              >
                Pagar con Webpay Plus (Débito/Crédito)
              </button>
              <button
                onClick={() => handlePayOrder('transfer')}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs rounded-xl shadow flex items-center justify-center transition-colors"
              >
                Transferencia Bancaria Directa
              </button>
              <button
                onClick={() => setSelectedOrderForPayment(null)}
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
