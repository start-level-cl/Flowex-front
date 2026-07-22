import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FilePlus, 
  MapPin, 
  Package, 
  Calculator, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { coverageZonesList, getCommuneZone } from '../../data/coverageZones';
import { mockCustomerProfile } from '../../data/mockData';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const savedRole = localStorage.getItem('flowex_user_role') || 'admin';
  const savedEnteredBy = (localStorage.getItem('flowex_entered_by') as 'cliente' | 'vendedor') || 'cliente';
  const savedSellerName = localStorage.getItem('flowex_seller_name') || 'Rodrigo Vendedor B2B';

  const [formData, setFormData] = useState({
    senderName: mockCustomerProfile.name,
    senderPhone: mockCustomerProfile.phone,
    senderAddress: mockCustomerProfile.savedAddresses[0].address,
    senderCommune: mockCustomerProfile.savedAddresses[0].commune,
    
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    recipientCommune: 'Viña del Mar',
    
    packagesCount: 1,
    packageType: 'Caja Mediana',
    weightKg: 2.5,
    declaredValue: 150000,
    shippingType: 'express' as 'normal' | 'express' | 'same_day',
    notes: ''
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Requirement 4: Automatic Zoning
  const zoneInfo = getCommuneZone(formData.recipientCommune);

  // Requirement 3: Insurance & Cost calculation
  const calculateInsurance = () => {
    const baseInsurance = 1000;
    const valueFee = formData.declaredValue > 50000 ? (formData.declaredValue - 50000) * 0.01 : 0;
    return Math.round(baseInsurance + valueFee);
  };

  const calculateTotalCost = () => {
    const baseShipping = 4500;
    const packageFee = formData.packagesCount * 800;
    const expressFee = formData.shippingType === 'express' ? 3000 : formData.shippingType === 'same_day' ? 5000 : 0;
    const insurance = calculateInsurance();
    return baseShipping + packageFee + expressFee + insurance;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneInfo.hasCoverage) return;

    const trackingNumber = `FX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-CL`;
    
    const newOrderData = {
      id: `ORD-${Date.now()}`,
      trackingNumber,
      enteredBy: savedEnteredBy,
      sellerName: savedEnteredBy === 'vendedor' ? savedSellerName : undefined,
      customerEmail: mockCustomerProfile.email,
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      senderAddress: formData.senderAddress,
      senderCommune: formData.senderCommune,
      
      recipientName: formData.recipientName,
      recipientPhone: formData.recipientPhone,
      recipientEmail: formData.recipientEmail || 'cliente@ejemplo.cl',
      recipientAddress: formData.recipientAddress,
      recipientCommune: formData.recipientCommune,
      
      packagesCount: formData.packagesCount,
      packageType: formData.packageType,
      weightKg: formData.weightKg,
      declaredValue: formData.declaredValue,
      insuranceCost: calculateInsurance(),
      shippingType: formData.shippingType,
      
      zone: zoneInfo.zoneName,
      
      status: 'pending',
      isPaid: false,
      baseCost: 4500,
      totalCost: calculateTotalCost(),
      
      createdAt: new Date().toLocaleString(),
      estimatedDelivery: 'Mañana 17:00 PM',
      notes: formData.notes,
      
      eventLogs: [
        {
          id: `EV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: savedEnteredBy === 'vendedor' ? savedSellerName : mockCustomerProfile.email,
          role: savedRole as any,
          action: 'Pedido Creado',
          details: `Ingresado por ${savedEnteredBy === 'vendedor' ? `vendedor ${savedSellerName}` : 'cliente directo'}. Zona asignada: ${zoneInfo.zoneName}.`
        }
      ],

      emailNotifications: [
        {
          id: `EM-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientEmail: formData.recipientEmail || 'cliente@ejemplo.cl',
          triggerEvent: 'order_created',
          subject: `FlowEx: Confirmación de Pedido ${trackingNumber}`,
          body: `Hola ${formData.recipientName}, tu pedido ha sido registrado con éxito.`,
          sent: true
        }
      ]
    };

    setCreatedOrder(newOrderData);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = (method: 'webpay' | 'credit_card' | 'transfer') => {
    if (!createdOrder) return;
    
    const paidOrder = {
      ...createdOrder,
      status: 'paid',
      isPaid: true,
      paymentMethod: method,
      paymentTransactionId: `TX-${method.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      paidAt: new Date().toLocaleString(),
      eventLogs: [
        ...createdOrder.eventLogs,
        {
          id: `EV-PAY-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: `Pasarela ${method.toUpperCase()}`,
          role: 'Sistema',
          action: 'Pago Confirmado',
          details: `Pago procesado automáticamente. Transacción aprobada.`
        }
      ]
    };

    setCreatedOrder(paidOrder);
    setShowPaymentModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-flow-primary uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
              Requerimientos 2, 3 y 4
            </span>
            <h1 className="text-xl font-headline font-bold text-slate-900 mt-1">
              Ingreso de Pedido con Zonificación
            </h1>
          </div>
        </div>

        {/* Requerimiento 2: Ingresado por */}
        <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-flow-primary" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Ingresado por:</span>
            <span className="font-semibold text-slate-800">
              {savedEnteredBy === 'vendedor' ? `Vendedor (${savedSellerName})` : 'Cliente Directo'}
            </span>
          </div>
        </div>
      </div>

      {createdOrder && !showPaymentModal ? (
        /* Order Created Success View */
        <div className="bg-white p-8 rounded-2xl border-2 border-emerald-200 shadow-flow text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {createdOrder.isPaid ? '¡Pedido Registrado y Pagado Exitosamente!' : '¡Pedido Registrado (Pendiente de Pago)!'}
            </span>
            <h2 className="text-3xl font-headline font-extrabold text-flow-primary mt-1 font-mono">
              {createdOrder.trackingNumber}
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Zonificación Automática: <span className="font-bold text-flow-secondary">{createdOrder.zone}</span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Destinatario:</span>
              <span className="font-semibold text-slate-900">{createdOrder.recipientName} ({createdOrder.recipientCommune})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bultos / Seguro:</span>
              <span className="font-medium text-slate-800">{createdOrder.packagesCount} bulto(s) | Seguro: ${createdOrder.insuranceCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-bold">Estado Pago:</span>
              <span className={`font-bold ${createdOrder.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                {createdOrder.isPaid ? `Pagado (${createdOrder.paymentMethod})` : 'Pendiente'}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button 
              onClick={() => navigate(`/tracking?code=${createdOrder.trackingNumber}`)}
              className="flex items-center px-4 py-2.5 bg-flow-primary text-white text-xs font-semibold rounded-xl shadow hover:bg-blue-900 transition-colors"
            >
              Ver Trazabilidad Pública <ArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
            </button>
            <button 
              onClick={() => { setCreatedOrder(null); }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Registrar Nuevo Pedido
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitForm} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          
          {/* Section 1: Cobertura & Comuna (Requerimientos 3 & 4) */}
          <div>
            <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-flow-secondary" /> 1. Destino & Zonificación Automática
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo Destinatario</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Mendoza"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico Destinatario</label>
                <input
                  type="email"
                  required
                  placeholder="carlos.mendoza@gmail.com"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Comuna de Destino (Validación Cobertura)</label>
                <select
                  value={formData.recipientCommune}
                  onChange={(e) => setFormData({ ...formData, recipientCommune: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none font-semibold"
                >
                  {coverageZonesList.map(c => (
                    <option key={c.commune} value={c.commune}>
                      {c.commune} {c.hasCoverage ? `(${c.zoneName})` : '⚠️ SIN COBERTURA'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Completa</label>
                <input
                  type="text"
                  required
                  placeholder="Calle San Martín 842"
                  value={formData.recipientAddress}
                  onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Coverage Warning / Automatic Zoning Display Box */}
            {!zoneInfo.hasCoverage ? (
              <div className="mt-4 bg-rose-50 p-4 rounded-xl border border-rose-200 flex items-center space-x-3 text-rose-800 text-xs font-semibold">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">Comuna Bloqueada:</span> {zoneInfo.message}
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-flow-primary" />
                  <span className="font-medium text-slate-700">Zonificación Automática Asignada:</span>
                  <span className="font-bold text-flow-primary font-headline">{zoneInfo.zoneName}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  ✓ Cobertura Garantizada
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Detalles de la Carga, Bultos & Seguro (Requerimiento 3) */}
          <div>
            <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2 text-flow-primary" /> 2. Carga, Bultos & Cálculo de Seguro
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad de Bultos</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.packagesCount}
                  onChange={(e) => setFormData({ ...formData, packagesCount: parseInt(e.target.value) || 1 })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Envío</label>
                <select
                  value={formData.shippingType}
                  onChange={(e) => setFormData({ ...formData, shippingType: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                >
                  <option value="normal">Normal Standard (48h)</option>
                  <option value="express">Express Priority (24h)</option>
                  <option value="same_day">Mismo Día (Same Day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Declarado ($ CLP)</label>
                <input
                  type="number"
                  step="5000"
                  value={formData.declaredValue}
                  onChange={(e) => setFormData({ ...formData, declaredValue: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Seguro Calculado ($)</label>
                <input
                  type="text"
                  disabled
                  value={`$${calculateInsurance().toLocaleString()} CLP`}
                  className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-bold text-flow-primary"
                />
              </div>
            </div>

            {/* Total Cost Display Box */}
            <div className="mt-6 bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-flow-secondary" />
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase">Resumen de Cotización Final</span>
                  <p className="text-[11px] text-slate-400">
                    Flete Base + {formData.packagesCount} bulto(s) + Seguro (${calculateInsurance().toLocaleString()})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-headline font-extrabold text-flow-secondary font-mono">
                  ${calculateTotalCost().toLocaleString()} CLP
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!zoneInfo.hasCoverage}
              className="px-6 py-2.5 bg-flow-primary text-white font-semibold text-xs rounded-xl shadow hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar al Pago & Despacho
            </button>
          </div>

        </form>
      )}

      {/* Requirement 5: Embedded Payment Gateway Modal */}
      {showPaymentModal && createdOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-flow-secondary" />
                <h3 className="font-headline font-bold text-slate-900 text-base">Pasarela de Pago Embebida</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Orden:</span> <span className="font-mono font-bold text-flow-primary">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Destino:</span> <span className="font-semibold">{createdOrder.recipientCommune}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-2">
                <span>Total a Pagar:</span>
                <span className="text-flow-secondary font-mono">${createdOrder.totalCost.toLocaleString()} CLP</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase">Selecciona el método de pago:</span>
              <button
                onClick={() => handleProcessPayment('webpay')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center transition-colors"
              >
                Pagar con Webpay Plus (Débito/Crédito)
              </button>
              <button
                onClick={() => handleProcessPayment('transfer')}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs rounded-xl shadow flex items-center justify-center transition-colors"
              >
                Transferencia Bancaria Inmediata
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-700 font-medium text-xs text-center"
              >
                Pagar después (Guardar como Pendiente)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
