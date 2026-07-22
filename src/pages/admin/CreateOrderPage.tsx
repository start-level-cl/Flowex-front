import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, Calculator, Printer, CheckCircle, ArrowLeft } from 'lucide-react';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    senderName: 'Importaciones Santiago S.A.',
    senderPhone: '+56 9 8765 4321',
    senderAddress: 'Av. Providencia 1234, Of 502',
    senderCity: 'Santiago',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: 'Viña del Mar',
    packageType: 'Caja Mediana',
    weightKg: 2.5,
    lengthCm: 30,
    widthCm: 20,
    heightCm: 15,
    declaredValue: 120000,
    hubOrigin: 'Hub Central Santiago',
    hubDestination: 'Hub Costa Viña',
    serviceLevel: 'Express 24h',
    notes: ''
  });

  const [createdTracking, setCreatedTracking] = useState<string | null>(null);

  const calculateCost = () => {
    const baseRate = 4500;
    const weightFee = formData.weightKg * 1200;
    const expressFee = formData.serviceLevel === 'Express 24h' ? 3500 : 0;
    return baseRate + weightFee + expressFee;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTracking = `FX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-CL`;
    setCreatedTracking(generatedTracking);
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
              Formulario Operativo Tradicional
            </span>
            <h1 className="text-xl font-headline font-bold text-slate-900 mt-1">
              Registro Manual de Pedido
            </h1>
          </div>
        </div>
      </div>

      {createdTracking ? (
        <div className="bg-white p-8 rounded-2xl border-2 border-emerald-200 shadow-flow text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              ¡Pedido Registrado con Éxito!
            </span>
            <h2 className="text-3xl font-headline font-extrabold text-flow-primary mt-1 font-mono">
              {createdTracking}
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Se ha generado la guía de despacho y asignado al Hub Origen: <span className="font-semibold">{formData.hubOrigin}</span>.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Destinatario:</span>
              <span className="font-semibold text-slate-900">{formData.recipientName} ({formData.recipientCity})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tarifa Calculada:</span>
              <span className="font-bold text-flow-secondary font-mono">${calculateCost().toLocaleString()} CLP</span>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center px-4 py-2.5 bg-flow-primary text-white text-xs font-semibold rounded-xl shadow hover:bg-blue-900 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" /> Imprimir Etiqueta de Despacho
            </button>
            <button 
              onClick={() => { setCreatedTracking(null); }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Registrar Otro Pedido
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          
          {/* Section 1: Remitente */}
          <div>
            <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-flow-secondary" /> 1. Datos del Remitente (Origen)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre / Empresa</label>
                <input
                  type="text"
                  required
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono de Contacto</label>
                <input
                  type="text"
                  required
                  value={formData.senderPhone}
                  onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Origen</label>
                <input
                  type="text"
                  required
                  value={formData.senderAddress}
                  onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad / Comuna Origen</label>
                <input
                  type="text"
                  required
                  value={formData.senderCity}
                  onChange={(e) => setFormData({ ...formData, senderCity: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Destinatario */}
          <div>
            <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" /> 2. Datos del Destinatario (Entrega)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo Destinatario</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Mendoza Ruiz"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Móvil Destinatario</label>
                <input
                  type="text"
                  required
                  placeholder="+56 9 1234 5678"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección Completa (Calle, Nº, Dpto)</label>
                <input
                  type="text"
                  required
                  placeholder="Calle San Martín 842, Dpto 3B"
                  value={formData.recipientAddress}
                  onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad Destino</label>
                <select
                  value={formData.recipientCity}
                  onChange={(e) => setFormData({ ...formData, recipientCity: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                >
                  <option value="Viña del Mar">Viña del Mar</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Concepción">Concepción</option>
                  <option value="Temuco">Temuco</option>
                  <option value="Antofagasta">Antofagasta</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Paquete y Cotización */}
          <div>
            <h3 className="text-sm font-headline font-bold text-flow-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2 text-flow-primary" /> 3. Detalles de la Carga & Tarifa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Empaque</label>
                <select
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                >
                  <option value="Caja Mediana">Caja Mediana</option>
                  <option value="Caja Grande">Caja Grande</option>
                  <option value="Documento / Sobre">Documento / Sobre</option>
                  <option value="Pallet Especial">Pallet Especial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Peso Estimado (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0.1 })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Declarado ($ CLP)</label>
                <input
                  type="number"
                  value={formData.declaredValue}
                  onChange={(e) => setFormData({ ...formData, declaredValue: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Total Cost Display Box */}
            <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator className="w-6 h-6 text-flow-primary" />
                <div>
                  <span className="text-xs font-bold text-flow-primary uppercase">Cálculo Automático de Tarifa</span>
                  <p className="text-[10px] text-slate-600">Incluye seguro base y transporte entre hubs.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-headline font-extrabold text-flow-secondary font-mono">
                  ${calculateCost().toLocaleString()} CLP
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
              className="px-6 py-2.5 bg-flow-primary text-white font-semibold text-xs rounded-xl shadow hover:bg-blue-900 transition-colors"
            >
              Generar Guía de Despacho
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
