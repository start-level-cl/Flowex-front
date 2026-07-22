import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  History, 
  CreditCard
} from 'lucide-react';
import { mockOrders } from '../../data/mockData';
import type { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PMVRequirementBadge } from '../../components/common/PMVRequirementBadge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderForLog, setSelectedOrderForLog] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesPaid = paidFilter === 'all' || (paidFilter === 'paid' ? order.isPaid : !order.isPaid);
    const matchesSearch = 
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipientCommune.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesPaid && matchesSearch;
  });

  const handleAssignDriver = (orderId: string, driverId: string, driverName: string) => {
    const currentAdmin = localStorage.getItem('flowex_user_email') || 'rbarria@flowex.cl';
    const currentRole = (localStorage.getItem('flowex_user_role') || 'admin') as any;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newLog = {
          id: `EV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: currentAdmin,
          role: currentRole,
          action: 'Asignación de Conductor',
          details: `Asignado conductor ${driverName} para entrega en ${o.zone}.`
        };
        return {
          ...o,
          assignedDriverId: driverId,
          assignedDriverName: driverName,
          eventLogs: [newLog, ...o.eventLogs]
        };
      }
      return o;
    }));
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const currentAdmin = localStorage.getItem('flowex_user_email') || 'rbarria@flowex.cl';
    const currentRole = (localStorage.getItem('flowex_user_role') || 'admin') as any;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newLog = {
          id: `EV-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          user: currentAdmin,
          role: currentRole,
          action: `Cambio de Estado: ${newStatus}`,
          details: `Estado actualizado a ${newStatus} desde el panel de administración.`
        };

        const trigger = newStatus === 'transit' ? 'in_transit' : newStatus === 'delivered' ? 'delivered' : newStatus === 'incident' ? 'failed' : 'order_created';
        const newEmail = {
          id: `EM-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          recipientEmail: o.recipientEmail,
          triggerEvent: trigger as any,
          subject: `FlowEx: Estado de tu paquete ${o.trackingNumber} cambiado a ${newStatus}`,
          body: `Hola ${o.recipientName}, tu envío ha cambiado de estado a ${newStatus}.`,
          sent: true
        };

        return {
          ...o,
          status: newStatus,
          eventLogs: [newLog, ...o.eventLogs],
          emailNotifications: [newEmail, ...o.emailNotifications]
        };
      }
      return o;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* PMV Requirement Banner */}
      <PMVRequirementBadge
        requirements={[
          { num: 4, title: 'Zonificación Automática Visible al Asignar Conductor' },
          { num: 8, title: 'Panel de Administración Limpio sin Dashboard Analítico' },
          { num: 9, title: 'Registro de Eventos (Log) por Usuario y Rol' }
        ]}
      />

      {/* Header Panel Operativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-headline font-bold text-slate-900">
            Panel de Administración Operativo
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Tabla limpia de pedidos, zonificación automática, asignación de conductor y registro de eventos por usuario.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/admin/create-order')}
          className="flex items-center px-4 py-2.5 bg-flow-primary text-white font-semibold text-xs rounded-xl shadow hover:bg-blue-900 transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Ingresar Nuevo Pedido
        </button>
      </div>

      {/* Main Table + Audit Log Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          
          <div>
            {/* Filter Tabs & Search */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Status Tabs */}
              <div className="flex flex-wrap gap-1">
                {(['all', 'pending', 'paid', 'picked_up', 'in_hub', 'transit', 'delivered', 'incident'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      activeTab === tab
                        ? 'bg-flow-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab === 'all' 
                      ? 'Todos' 
                      : tab === 'pending' 
                      ? 'Pendiente Pago' 
                      : tab === 'paid' 
                      ? 'Pagado' 
                      : tab === 'picked_up'
                      ? 'Recogido (Foto)'
                      : tab === 'in_hub'
                      ? 'En Hub CD'
                      : tab === 'transit' 
                      ? 'En Reparto' 
                      : tab === 'delivered' 
                      ? 'Entregado' 
                      : 'Incidencia'}
                  </button>
                ))}
              </div>

              {/* Payment Filter & Search */}
              <div className="flex items-center space-x-2">
                <select
                  value={paidFilter}
                  onChange={(e) => setPaidFilter(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700"
                >
                  <option value="all">Todos los Pagos</option>
                  <option value="paid">Solo Pagados</option>
                  <option value="unpaid">Solo Pendientes Pago</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar por Guía / Destinatario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-44 pl-8 pr-2 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-flow-primary focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                </div>
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 uppercase text-[10px] text-slate-500 font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Tracking & Origen</th>
                    <th className="py-3 px-3">Destinatario & Comuna</th>
                    <th className="py-3 px-3">Zonificación Automática</th>
                    <th className="py-3 px-3">Pago / Estado</th>
                    <th className="py-3 px-3">Driver Asignado</th>
                    <th className="py-3 px-3 text-right">Editar Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(order => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${selectedOrderForLog?.id === order.id ? 'bg-blue-50/50' : ''}`}
                      onClick={() => setSelectedOrderForLog(order)}
                    >
                      <td className="py-3 px-3 cursor-pointer">
                        <div className="font-bold text-flow-primary font-mono text-xs">{order.trackingNumber}</div>
                        <div className="text-[10px] text-slate-500">
                          {order.enteredBy === 'vendedor' ? `Vendedor: ${order.sellerName}` : 'Cliente Directo'}
                        </div>
                      </td>

                      <td className="py-3 px-3 cursor-pointer">
                        <div className="font-semibold text-slate-900">{order.recipientName}</div>
                        <div className="text-[10px] text-slate-500">{order.recipientAddress}, {order.recipientCommune}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block bg-blue-100 text-flow-primary font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                          {order.zone}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <StatusBadge status={order.status} size="sm" />
                          <div>
                            {order.isPaid ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-flex items-center">
                                <CreditCard className="w-3 h-3 mr-1" /> Pagado
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                Pendiente Pago
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={order.assignedDriverId || ''}
                          onChange={(e) => {
                            const dId = e.target.value;
                            const dName = dId === 'DRV-01' ? 'Roberto Gómez' : dId === 'DRV-02' ? 'Camila Rojas' : 'Juan Pablo Valenzuela';
                            handleAssignDriver(order.id, dId, dName);
                          }}
                          className="bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-flow-primary focus:outline-none"
                        >
                          <option value="">Seleccionar Driver...</option>
                          <option value="DRV-01">Roberto Gómez (Z-3)</option>
                          <option value="DRV-02">Camila Rojas (Z-1)</option>
                          <option value="DRV-03">Juan P. Valenzuela (Z-5)</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-white border border-slate-300 text-[11px] font-semibold text-slate-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-flow-primary focus:outline-none"
                        >
                          <option value="pending">Pendiente Pago</option>
                          <option value="paid">Pagado</option>
                          <option value="pickup_assigned">Recogida Asignada</option>
                          <option value="picked_up">Recogido (Foto)</option>
                          <option value="in_hub">En Hub CD</option>
                          <option value="transit">En Reparto Final</option>
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

          <div className="p-3 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Mostrando {filteredOrders.length} de {orders.length} pedidos</span>
            <span className="font-semibold text-flow-primary">Haz clic en una fila para ver su Registro de Eventos (Log)</span>
          </div>

        </div>

        {/* Audit Event Log Sidebar (Requerimiento 9) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-flow-primary" />
                <h3 className="font-headline font-bold text-slate-900 text-base">Registro de Eventos (Log)</h3>
              </div>
            </div>

            {selectedOrderForLog ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Orden Seleccionada</span>
                  <span className="font-mono font-bold text-flow-primary text-sm">{selectedOrderForLog.trackingNumber}</span>
                  <div className="text-slate-700 mt-1 font-semibold">{selectedOrderForLog.recipientName} ({selectedOrderForLog.zone})</div>
                </div>

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {selectedOrderForLog.eventLogs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-flow-primary">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-700 text-[11px]">{log.details}</p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60 flex justify-between">
                        <span>Usuario: {log.user}</span>
                        <span className="uppercase font-bold text-flow-secondary">[{log.role}]</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                Haz clic en cualquier pedido de la tabla izquierda para inspeccionar sus eventos y auditoría.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button 
              onClick={() => setSelectedOrderForLog(orders[0])}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Ver Log del Primer Envío
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
