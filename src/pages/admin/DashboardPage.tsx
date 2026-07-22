import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  History, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { mockOrders, mockAuditLogs } from '../../data/mockData';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate Metrics
  const totalOrders = orders.length;
  const inTransitCount = orders.filter(o => o.status === 'transit').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const incidentCount = orders.filter(o => o.status === 'incident').length;

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientCity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-flow-primary uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Fase Operativa 1
          </span>
          <h1 className="text-2xl font-headline font-bold text-slate-900 mt-2">
            Gestión de Pedidos & Auditoría
          </h1>
          <p className="text-xs text-slate-600">
            Monitoreo en tiempo real de paquetes, despacho interurbano y registro de incidencias.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate('/admin/smart-order')}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-flow-secondary to-orange-500 text-white font-semibold text-xs rounded-xl shadow hover:opacity-95 transition-all"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Nuevo Pedido Inteligente
          </button>
          <button 
            onClick={() => navigate('/admin/create-order')}
            className="flex items-center px-4 py-2 bg-flow-primary text-white font-semibold text-xs rounded-xl shadow hover:bg-blue-900 transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Formulario Tradicional
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Envíos</p>
            <h3 className="text-2xl font-headline font-extrabold text-slate-900 mt-1">{totalOrders}</h3>
            <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">Registrados en sistema</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-flow-primary rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">En Tránsito</p>
            <h3 className="text-2xl font-headline font-extrabold text-flow-primary mt-1">{inTransitCount}</h3>
            <span className="text-[10px] text-blue-600 font-medium mt-1 inline-block">En ruta de entrega</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-flow-primary rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Entregados</p>
            <h3 className="text-2xl font-headline font-extrabold text-emerald-600 mt-1">{deliveredCount}</h3>
            <span className="text-[10px] text-emerald-600 font-medium mt-1 inline-block">POD Confirmado</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Incidencias</p>
            <h3 className="text-2xl font-headline font-extrabold text-rose-600 mt-1">{incidentCount}</h3>
            <span className="text-[10px] text-rose-600 font-medium mt-1 inline-block">Atención requerida</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Table + Audit Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          
          <div>
            {/* Filter Tabs & Search */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex flex-wrap gap-1">
                {(['all', 'pending', 'paid', 'transit', 'delivered', 'incident'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-flow-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab === 'all' ? 'Todos' : tab === 'pending' ? 'Pendiente' : tab === 'paid' ? 'Pagado' : tab === 'transit' ? 'En Tránsito' : tab === 'delivered' ? 'Entregado' : 'Incidencias'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar N° Guía o Destinatario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/70 uppercase text-[10px] text-slate-500 font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Tracking & Destinatario</th>
                    <th className="py-3 px-4">Ruta (Origen $\rightarrow$ Destino)</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Driver Asignado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-flow-primary font-mono text-xs">{order.trackingNumber}</div>
                        <div className="font-semibold text-slate-900">{order.recipientName}</div>
                        <div className="text-[10px] text-slate-500">{order.packageType} ({order.weightKg} kg)</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{order.senderCity} $\rightarrow$ {order.recipientCity}</div>
                        <div className="text-[10px] text-slate-500">{order.recipientAddress}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {order.assignedDriverName ? (
                          <span className="inline-flex items-center text-xs text-slate-700 font-medium">
                            <Truck className="w-3 h-3 mr-1 text-flow-secondary" />
                            {order.assignedDriverName}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sin asignar</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/tracking?code=${order.trackingNumber}`)}
                          className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold text-flow-primary bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Ver Guía <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No se encontraron envíos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Mostrando {filteredOrders.length} de {orders.length} pedidos</span>
            <button onClick={() => navigate('/admin/operations')} className="text-flow-primary font-semibold hover:underline flex items-center">
              Ir a Tabla Operativa Fase 1 <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

        </div>

        {/* Audit Log Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-flow-primary" />
                <h3 className="font-headline font-bold text-slate-900 text-base">Bitácora de Auditoría</h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                En vivo
              </span>
            </div>

            <div className="space-y-4">
              {mockAuditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-flow-primary">{log.action}</span>
                    <span className="text-[10px] text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {log.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] mb-1 font-mono font-semibold">
                    Guía: {log.trackingNumber}
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400 text-right font-mono">
                    Por: {log.user}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200">
            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
              Descargar Informe Completo (CSV)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
