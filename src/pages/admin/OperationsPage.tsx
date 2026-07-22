import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Truck, 
  Download, 
  RefreshCw, 
  UserPlus 
} from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const OperationsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterZone, setFilterZone] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(orders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus: OrderStatus) => {
    if (selectedIds.length === 0) return;
    setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status: newStatus } : o));
    setSelectedIds([]);
  };

  const filteredOrders = orders.filter(o => {
    const matchesZone = filterZone === 'all' || o.zone.includes(filterZone);
    const matchesSearch = o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.senderName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesZone && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 8, title: 'Panel de Administración Operativo & Filtros Básicos' },
          { num: 9, title: 'Edición de Estados & Registro de Eventos' }
        ]}
      />

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-flow-primary" />
            <h1 className="text-2xl font-headline font-bold text-slate-900">Gestión Operativa Fase 1</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Consola avanzada para control de despachos, asignación masiva de conductores y cambio de estados.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setOrders([...mockOrders])}
            className="flex items-center px-3 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Recargar Datos
          </button>
          <button className="flex items-center px-4 py-2 bg-flow-primary text-white font-semibold text-xs rounded-xl shadow hover:bg-blue-900 transition-all">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Exportar Manifiesto
          </button>
        </div>
      </div>

      {/* Bulk Controls & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Bulk Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Acciones en lote ({selectedIds.length}):</span>
            <button
              disabled={selectedIds.length === 0}
              onClick={() => handleBulkStatusChange('transit')}
              className="px-2.5 py-1 bg-blue-50 text-flow-primary text-xs font-semibold rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed border border-blue-200"
            >
              Pasar a "En Tránsito"
            </button>
            <button
              disabled={selectedIds.length === 0}
              onClick={() => handleBulkStatusChange('delivered')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-200"
            >
              Marcar Entregados
            </button>
          </div>

          {/* Zone Filters & Search */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-flow-primary focus:outline-none"
            >
              <option value="all">Todas las Zonas</option>
              <option value="Z-1">Zona Santiago (Z-1 / Z-2)</option>
              <option value="Z-3">Zona Costa (Z-3)</option>
              <option value="Z-4">Zona Sur Concepción (Z-4)</option>
              <option value="Z-5">Zona Sur Temuco (Z-5)</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por Guía, Cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

        </div>

        {/* Detailed Operations Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 uppercase text-[10px] text-slate-500 font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-flow-primary focus:ring-flow-primary"
                  />
                </th>
                <th className="py-3 px-3">Nº Guía / Tracking</th>
                <th className="py-3 px-3">Remitente</th>
                <th className="py-3 px-3">Destinatario</th>
                <th className="py-3 px-3">Zonificación Automática</th>
                <th className="py-3 px-3">Estado Operativo</th>
                <th className="py-3 px-3">Conductor Asignado</th>
                <th className="py-3 px-3 text-right">Cambiar Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className={selectedIds.includes(order.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'}>
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      className="rounded border-slate-300 text-flow-primary focus:ring-flow-primary"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-flow-primary">{order.trackingNumber}</span>
                    <div className="text-[10px] text-slate-400">{order.packageType} ({order.packagesCount} bultos)</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{order.senderName}</div>
                    <div className="text-[10px] text-slate-400">{order.senderCommune}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{order.recipientName}</div>
                    <div className="text-[10px] text-slate-400">{order.recipientCommune}</div>
                  </td>
                  <td className="py-3 px-3 text-[11px] font-medium text-slate-600">
                    <span className="bg-blue-50 text-flow-primary font-bold px-2 py-0.5 rounded border border-blue-200">
                      {order.zone}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-3">
                    {order.assignedDriverName ? (
                      <span className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <Truck className="w-3 h-3 mr-1 text-flow-secondary" />
                        {order.assignedDriverName}
                      </span>
                    ) : (
                      <button className="text-[11px] text-flow-secondary font-semibold hover:underline flex items-center">
                        <UserPlus className="w-3 h-3 mr-1" /> Asignar Driver
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        const newSt = e.target.value as OrderStatus;
                        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newSt } : o));
                      }}
                      className="bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-flow-primary focus:outline-none"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="paid">Pagado</option>
                      <option value="transit">En Tránsito</option>
                      <option value="delivered">Entregado</option>
                      <option value="incident">Incidencia</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
