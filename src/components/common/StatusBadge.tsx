import React from 'react';
import type { OrderStatus } from '../../types';
import { Clock, CheckCircle2, Truck, AlertTriangle, CreditCard } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<OrderStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    pending: {
      label: 'Pendiente',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <Clock className="w-3.5 h-3.5 mr-1" />
    },
    paid: {
      label: 'Pagado',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CreditCard className="w-3.5 h-3.5 mr-1" />
    },
    transit: {
      label: 'En Tránsito',
      bg: 'bg-blue-50',
      text: 'text-flow-primary',
      border: 'border-blue-200',
      icon: <Truck className="w-3.5 h-3.5 mr-1" />
    },
    delivered: {
      label: 'Entregado',
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
    },
    incident: {
      label: 'Incidencia',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />
    }
  };

  const config = configs[status] || configs.pending;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      {config.icon}
      {config.label}
    </span>
  );
};
