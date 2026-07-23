import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Package, 
  Calculator, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ShieldCheck,
  UserCheck,
  Tag,
  Layers,
  Plus,
  Trash2,
  Key
} from 'lucide-react';
import { coverageZonesList, getCommuneZone } from '../../data/coverageZones';
import { mockCustomerProfile } from '../../data/mockData';
import { validateAndApplyPromoCode } from '../../data/promoCodes';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const savedRole = localStorage.getItem('flowex_user_role') || 'admin';
  const savedEnteredBy = (localStorage.getItem('flowex_entered_by') as 'cliente' | 'vendedor') || 'cliente';
  const savedSellerName = localStorage.getItem('flowex_seller_name') || 'Rodrigo Vendedor B2B';

  // Mode: Single vs Multiple (Batch)
  const [entryMode, setEntryMode] = useState<'single' | 'batch'>('single');

  const [formData, setFormData] = useState({
    senderName: mockCustomerProfile.name,
    senderPhone: mockCustomerProfile.phone,
    senderAddress: mockCustomerProfile.savedAddresses[0].address,
    senderCommune: mockCustomerProfile.savedAddresses[0].commune,
    
    recipientName: '',
    recipientPhone: '+569 8225 7217',
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

  // State for Batch / Multiple orders
  const [batchItems, setBatchItems] = useState<Array<{
    id: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
    recipientAddress: string;
    recipientCommune: string;
    packagesCount: number;
    declaredValue: number;
    shippingType: 'normal' | 'express' | 'same_day';
  }>>([
    {
      id: 'batch-1',
      recipientName: 'Carlos Mendoza',
      recipientPhone: '+569 8225 7217',
      recipientEmail: 'carlos.mendoza@gmail.com',
      recipientAddress: 'Calle San Martín 842',
      recipientCommune: 'Viña del Mar',
      packagesCount: 2,
      declaredValue: 120000,
      shippingType: 'express'
    },
    {
      id: 'batch-2',
      recipientName: 'Dra. María Torres',
      recipientPhone: '+569 8225 7217',
      recipientEmail: 'maria.torres@clinicadevalpo.cl',
      recipientAddress: 'Av. Las Condes 9820',
      recipientCommune: 'Las Condes',
      packagesCount: 1,
      declaredValue: 85000,
      shippingType: 'normal'
    }
  ]);

  // Requirement 1: Promo code state
  const [inputPromoCode, setInputPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    description: string;
    discountAmount: number;
  } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

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

  const calculateSubtotalCost = () => {
    const baseShipping = 4500;
    const packageFee = formData.packagesCount * 800;
    const expressFee = formData.shippingType === 'express' ? 3000 : formData.shippingType === 'same_day' ? 5000 : 0;
    const insurance = calculateInsurance();
    return baseShipping + packageFee + expressFee + insurance;
  };

  const calculateFinalTotalCost = () => {
    const subtotal = calculateSubtotalCost();
    const discount = appliedPromo ? appliedPromo.discountAmount : 0;
    return Math.max(0, subtotal - discount);
  };

  const handleApplyPromoCode = () => {
    if (!inputPromoCode.trim()) return;
    const subtotal = calculateSubtotalCost();
    const result = validateAndApplyPromoCode(inputPromoCode, subtotal);
    if (result.isValid && result.promoCode) {
      setAppliedPromo({
        code: result.promoCode.code,
        description: result.promoCode.description,
        discountAmount: result.discountAmount
      });
      setPromoMessage({ text: result.message, isError: false });
    } else {
      setAppliedPromo(null);
      setPromoMessage({ text: result.message, isError: true });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setInputPromoCode('');
    setPromoMessage(null);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneInfo.hasCoverage) return;

    const trackingNumber = `FX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-CL`;
    const subtotal = calculateSubtotalCost();
    const finalTotal = calculateFinalTotalCost();
    const deliveryCode = `FLW-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderData = {
      id: `ORD-${Date.now()}`,
      trackingNumber,
      deliveryCode,
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
      hubName: 'Hub Central Pudahuel',
      
      status: 'pending',
      isPaid: false,
      baseCost: 4500,
      totalCost: finalTotal,
      originalTotalCost: subtotal,
      promoCode: appliedPromo?.code,
      discountAmount: appliedPromo?.discountAmount || 0,
      
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
          details: `Ingresado por ${savedEnteredBy === 'vendedor' ? `vendedor ${savedSellerName}` : 'cliente directo'}. Zona: ${zoneInfo.zoneName}.${appliedPromo ? ` Descuento aplicado con código ${appliedPromo.code} (-$${appliedPromo.discountAmount.toLocaleString()}).` : ''}`
        }
      ],

      emailNotifications: [
        {
          id: `EM-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientEmail: formData.recipientEmail || 'cliente@ejemplo.cl',
          triggerEvent: 'order_created',
          subject: `FlowEx: Confirmación de Pedido ${trackingNumber}`,
          body: `Hola ${formData.recipientName}, tu pedido ha sido registrado con éxito. Tu código seguro de entrega para el driver es: ${deliveryCode}`,
          sent: true
        }
      ],

      whatsappNotifications: []
    };

    setCreatedOrder(newOrderData);
    setShowPaymentModal(true);
  };

  // Helper functions for Batch Mode
  const addBatchRow = () => {
    setBatchItems([
      ...batchItems,
      {
        id: `batch-${Date.now()}`,
        recipientName: '',
        recipientPhone: '+569 8225 7217',
        recipientEmail: '',
        recipientAddress: '',
        recipientCommune: 'Santiago',
        packagesCount: 1,
        declaredValue: 50000,
        shippingType: 'normal'
      }
    ]);
  };

  const removeBatchRow = (id: string) => {
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const updateBatchRow = (id: string, field: string, value: any) => {
    setBatchItems(batchItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateBatchSubtotal = () => {
    return batchItems.reduce((acc, item) => {
      const base = 4500;
      const pkg = item.packagesCount * 800;
      const express = item.shippingType === 'express' ? 3000 : item.shippingType === 'same_day' ? 5000 : 0;
      const insurance = item.declaredValue > 50000 ? Math.round(1000 + (item.declaredValue - 50000) * 0.01) : 1000;
      return acc + base + pkg + express + insurance;
    }, 0);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchItems.length === 0) return;

    const trackingNumber = `FX-BATCH-${Math.floor(1000 + Math.random() * 9000)}-CL`;
    const batchTotal = calculateBatchSubtotal();
    const deliveryCode = `FLW-BATCH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderData = {
      id: `ORD-BATCH-${Date.now()}`,
      trackingNumber,
      deliveryCode,
      enteredBy: savedEnteredBy,
      sellerName: savedEnteredBy === 'vendedor' ? savedSellerName : undefined,
      customerEmail: mockCustomerProfile.email,
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      senderAddress: formData.senderAddress,
      senderCommune: formData.senderCommune,
      
      recipientName: `Lote de ${batchItems.length} Envíos`,
      recipientPhone: '+569 8225 7217',
      recipientEmail: mockCustomerProfile.email,
      recipientAddress: `${batchItems.length} direcciones ingresadas`,
      recipientCommune: batchItems[0]?.recipientCommune || 'Providencia',
      
      packagesCount: batchItems.reduce((sum, i) => sum + i.packagesCount, 0),
      packageType: `Multibulto (${batchItems.length} destinatarios)`,
      weightKg: batchItems.length * 2.0,
      declaredValue: batchItems.reduce((sum, i) => sum + i.declaredValue, 0),
      insuranceCost: 3500,
      shippingType: 'express',
      
      zone: 'Multizona Santiago & V Región',
      hubName: 'Hub Central Pudahuel',
      
      status: 'pending',
      isPaid: false,
      baseCost: 4500 * batchItems.length,
      totalCost: batchTotal,
      
      createdAt: new Date().toLocaleString(),
      estimatedDelivery: 'Mañana 17:00 PM',
      notes: `Ingreso masivo de ${batchItems.length} pedidos.`,
      
      eventLogs: [
        {
          id: `EV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: savedEnteredBy === 'vendedor' ? savedSellerName : mockCustomerProfile.email,
          role: savedRole as any,
          action: 'Ingreso Masivo de Pedidos',
          details: `Lote de ${batchItems.length} envíos registrado con éxito por ${savedEnteredBy === 'vendedor' ? savedSellerName : 'cliente'}.`
        }
      ],

      emailNotifications: [],
      whatsappNotifications: []
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
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 2, title: 'Persistencia de Cliente & Campo "Ingresado por"' },
          { num: 3, title: 'Formulario de Pedido, Bultos, Tipo de Envío & Seguro' },
          { num: 4, title: 'Zonificación Automática por Comuna' },
          { num: 5, title: 'Pasarela de Pago Integrada Embebida' }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl font-headline font-bold text-slate-900">
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

      {/* Entry Mode Switcher: Single vs Multiple */}
      {!createdOrder && (
        <div className="flex space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setEntryMode('single')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center ${
              entryMode === 'single'
                ? 'bg-flow-primary text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4 mr-2" /> 1. Ingreso Único (1 Pedido)
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('batch')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center ${
              entryMode === 'batch'
                ? 'bg-flow-secondary text-white shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 mr-2" /> 2. Ingreso Múltiple / Masivo ({batchItems.length} Envíos)
          </button>
        </div>
      )}

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

            {createdOrder.deliveryCode && (
              <div className="mt-3 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 inline-flex items-center space-x-2 text-xs text-emerald-900 font-bold shadow-sm">
                <Key className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Código Seguro para el Cliente (PIN): <span className="font-mono text-base font-extrabold text-flow-primary tracking-wider">{createdOrder.deliveryCode}</span></span>
              </div>
            )}
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
      ) : entryMode === 'batch' ? (
        /* Batch / Multiple Orders Entry Form */
        <form onSubmit={handleBatchSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-headline font-bold text-flow-primary flex items-center">
                <Layers className="w-5 h-5 mr-2 text-flow-secondary" /> Ingreso Masivo / Múltiples Pedidos
              </h3>
              <p className="text-xs text-slate-500">Agrega múltiples destinatarios para generar sus envíos en una sola operación.</p>
            </div>
            <button
              type="button"
              onClick={addBatchRow}
              className="px-3.5 py-2 bg-flow-primary hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Agregar Otro Envío
            </button>
          </div>

          <div className="space-y-4">
            {batchItems.map((item, index) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 relative">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-flow-primary font-mono bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded">
                    Envío #{index + 1}
                  </span>
                  {batchItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBatchRow(item.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 flex items-center font-bold"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Quitar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Destinatario</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre del cliente"
                      value={item.recipientName}
                      onChange={(e) => updateBatchRow(item.id, 'recipientName', e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Teléfono Contacto</label>
                    <input
                      type="text"
                      required
                      value={item.recipientPhone}
                      onChange={(e) => updateBatchRow(item.id, 'recipientPhone', e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Comuna Destino</label>
                    <select
                      value={item.recipientCommune}
                      onChange={(e) => updateBatchRow(item.id, 'recipientCommune', e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary font-semibold"
                    >
                      {coverageZonesList.map(c => (
                        <option key={c.commune} value={c.commune}>
                          {c.commune} {c.hasCoverage ? `(${c.zoneName})` : '⚠️ SIN COBERTURA'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      required
                      placeholder="Calle y número"
                      value={item.recipientAddress}
                      onChange={(e) => updateBatchRow(item.id, 'recipientAddress', e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bultos</label>
                    <input
                      type="number"
                      min="1"
                      value={item.packagesCount}
                      onChange={(e) => updateBatchRow(item.id, 'packagesCount', parseInt(e.target.value) || 1)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Valor Declarado ($)</label>
                    <input
                      type="number"
                      value={item.declaredValue}
                      onChange={(e) => updateBatchRow(item.id, 'declaredValue', parseInt(e.target.value) || 0)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-flow-secondary" />
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase">Resumen de Lote ({batchItems.length} envíos)</span>
                <p className="text-[11px] text-slate-400">Total Bultos: {batchItems.reduce((s, i) => s + i.packagesCount, 0)} bulto(s)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-headline font-extrabold text-flow-secondary font-mono">
                ${calculateBatchSubtotal().toLocaleString()} CLP
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-flow-secondary hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Procesar Lote ({batchItems.length} Envíos) $\rightarrow$
            </button>
          </div>
        </form>
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

            {/* Requirement 1: Promo Code Box */}
            <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-flow-secondary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Código Promocional / Descuento (Opcional)
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ej: FLOW10, DESCUENTO20, BIENVENIDA5000, ENVIOFREE"
                  value={inputPromoCode}
                  onChange={(e) => setInputPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-flow-primary focus:outline-none font-mono font-bold uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromoCode}
                  className="px-4 py-2 bg-flow-secondary hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Aplicar Descuento
                </button>
              </div>

              {promoMessage && (
                <div className={`text-xs font-semibold p-2.5 rounded-xl border flex items-center justify-between ${
                  promoMessage.isError ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  <span>{promoMessage.text}</span>
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[10px] underline font-bold ml-2 text-slate-500 hover:text-slate-800"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Total Cost & Discount Display Box */}
            <div className="mt-6 bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-flow-secondary" />
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase">Resumen de Cotización Final</span>
                  <p className="text-[11px] text-slate-400">
                    Subtotal: ${calculateSubtotalCost().toLocaleString()} CLP
                    {appliedPromo && (
                      <span className="text-emerald-400 font-bold ml-1.5">
                        • Descuento {appliedPromo.code}: -${appliedPromo.discountAmount.toLocaleString()} CLP
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {appliedPromo && (
                  <span className="block text-xs text-slate-400 line-through">
                    ${calculateSubtotalCost().toLocaleString()} CLP
                  </span>
                )}
                <span className="text-3xl font-headline font-extrabold text-flow-secondary font-mono">
                  ${calculateFinalTotalCost().toLocaleString()} CLP
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
