import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  FilePlus, 
  MapPin, 
  CreditCard, 
  Truck, 
  Smartphone, 
  LayoutDashboard, 
  History, 
  Search, 
  MessageCircle,
  Tag,
  PackageCheck,
  Building2
} from 'lucide-react';

interface PMVRequirementDetail {
  num: number;
  title: string;
  category: string;
  description: string;
  implementation: string;
  targetPath: string;
  icon: React.ReactNode;
}

export const PMVRequirementsPage: React.FC = () => {
  const navigate = useNavigate();

  const requirementsList: PMVRequirementDetail[] = [
    {
      num: 1,
      title: 'Autenticación con roles',
      category: 'Seguridad & Permisos',
      description: 'Login real con permisos diferenciados: Cliente, Admin/Coordinador y Driver.',
      implementation: 'Modo de ingreso interactivo con persistencia de token/rol en localStorage y menús dinámicos.',
      targetPath: '/',
      icon: <UserCheck className="w-5 h-5 text-blue-600" />
    },
    {
      num: 2,
      title: 'Registro y persistencia de cliente',
      category: 'Clientes & Origen',
      description: 'Cuenta con datos guardados entre pedidos; campo "ingresado por" para identificar si fue el cliente o un vendedor.',
      implementation: 'Persistencia de perfil de cliente con direcciones guardadas y selector de origen "Cliente Directo" vs "Vendedor/Ejecutivo B2B".',
      targetPath: '/customer/orders',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      num: 3,
      title: 'Ingreso de pedido',
      category: 'Cotización & Carga',
      description: 'Formulario con comuna, bloqueo de comunas sin cobertura, cantidad de bultos, tipo de envío, valor declarado y cálculo del seguro.',
      implementation: 'Formulario dinámico que bloquea envíos sin cobertura (ej: Punta Arenas) y cotiza flete + seguro automático (1% sobre valor declarado).',
      targetPath: '/admin/create-order',
      icon: <FilePlus className="w-5 h-5 text-flow-primary" />
    },
    {
      num: 4,
      title: 'Zonificación automática',
      category: 'Logística & Cobertura',
      description: 'Asignación de zona según comuna, visible para el admin al asignar driver.',
      implementation: 'Motor de mapeo instantáneo por comuna que asigna etiquetas tarifarias (Z-1 Santiago, Z-3 Costa Viña, Z-4 Concepción, Z-5 Temuco).',
      targetPath: '/admin',
      icon: <MapPin className="w-5 h-5 text-flow-secondary" />
    },
    {
      num: 5,
      title: 'Pasarela de pago integrada',
      category: 'Finanzas & Cobranza',
      description: 'Pago embebido con separación automática pagado / no pagado.',
      implementation: 'Modal embebido de pago (Webpay, Transferencia) que actualiza el estado a Pagado o permite guardarlo como Pendiente de Pago.',
      targetPath: '/customer/orders',
      icon: <CreditCard className="w-5 h-5 text-amber-600" />
    },
    {
      num: 6,
      title: 'Ruta del día',
      category: 'Despacho Driver',
      description: 'Generada automáticamente (pagados + pendientes del día anterior), filtrada por driver.',
      implementation: 'Consola de ruta diaria que une cargas pagadas y pendientes asignadas específicamente al driver en sesión.',
      targetPath: '/driver/route',
      icon: <Truck className="w-5 h-5 text-flow-secondary" />
    },
    {
      num: 7,
      title: 'Cambio de estado en terreno',
      category: 'Operaciones Terreno',
      description: 'El driver actualiza el estado de sus pedidos desde una vista simple, sin mapa ni modo offline.',
      implementation: 'Interfaz móvil liviana para conductores con botones directos: "En Camino", "Entregado" y "No Entregado / Incidencia".',
      targetPath: '/driver/daily',
      icon: <Smartphone className="w-5 h-5 text-purple-600" />
    },
    {
      num: 8,
      title: 'Panel de administración',
      category: 'Administración & Control',
      description: 'Tabla de pedidos con filtros básicos, asignación de driver y edición de estados, sin dashboard analítico.',
      implementation: 'Tabla limpia operativa centralizada con filtros por estado, tipo de pago, asignador de driver y edición rápida.',
      targetPath: '/admin',
      icon: <LayoutDashboard className="w-5 h-5 text-blue-800" />
    },
    {
      num: 9,
      title: 'Registro de eventos (log)',
      category: 'Auditoría & Trazabilidad',
      description: 'Cada acción registrada con usuario y rol responsable.',
      implementation: 'Bitácora imutable de eventos vinculada a cada paquete que registra timestamp, email de usuario y rol (customer, admin, driver, sistema).',
      targetPath: '/admin',
      icon: <History className="w-5 h-5 text-flow-primary" />
    },
    {
      num: 10,
      title: 'Vista externa de seguimiento',
      category: 'Trazabilidad Pública',
      description: 'Página pública de trazabilidad leyendo el log de eventos.',
      implementation: 'Módulo abierto sin requerir login donde cualquier destinatario consulta su número de guía leyendo el log de eventos en vivo.',
      targetPath: '/tracking',
      icon: <Search className="w-5 h-5 text-slate-700" />
    },
    {
      num: 11,
      title: 'Notificaciones automáticas (Email & WhatsApp)',
      category: 'Comunicaciones',
      description: 'Envío de correo y alerta por WhatsApp en cambios de estado clave (creado, en camino, entregado, no entregado).',
      implementation: 'Trigger automático de email e integración con WhatsApp Web API que notifica al cliente en cada cambio de hito.',
      targetPath: '/tracking',
      icon: <MessageCircle className="w-5 h-5 text-emerald-600" />
    },
    {
      num: 12,
      title: 'Códigos promocionales & Descuentos',
      category: 'Finanzas & Promociones',
      description: 'Sistema de cupones promocionales con descuentos aplicables al momento de cotizar y realizar el pago.',
      implementation: 'Validación en vivo de códigos (FLOW10, DESCUENTO20, BIENVENIDA5000, ENVIOFREE) recalculando el costo total y reflejando el descuento.',
      targetPath: '/customer/create',
      icon: <Tag className="w-5 h-5 text-purple-600" />
    },
    {
      num: 13,
      title: 'Flujo completo de envío (Recogida -> CD Hub -> Reparto)',
      category: 'Ciclo Logístico Integrado',
      description: 'Flujo end-to-end: Cliente genera paquete -> Driver acude a retirar y toma foto de recepción -> Entrega en Centro de Distribución -> Reparto final.',
      implementation: 'Captura de foto de recepción en origen (remitente), marca de ingreso a Centro de Distribución y trazabilidad de todos los estados del paquete.',
      targetPath: '/driver/daily',
      icon: <Building2 className="w-5 h-5 text-indigo-600" />
    },
    {
      num: 14,
      title: 'Generación de ruta de recogida',
      category: 'Optimización de Ruta Driver',
      description: 'La aplicación genera automáticamente rutas organizadas para la recolección de paquetes en origen.',
      implementation: 'Modulo de enrutamiento dual que clasifica y ordena las paradas de recolección de los conductores previa entrega al Centro de Distribución.',
      targetPath: '/driver/route',
      icon: <PackageCheck className="w-5 h-5 text-orange-600" />
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-flow-primary to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-900">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-flow-secondary" />
            <span className="text-xs font-mono font-bold text-flow-secondary uppercase tracking-widest">
              Especificación PMV FlowEx 1.1 (Con Nuevos Requerimientos)
            </span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold">Matriz de Requerimientos del Frontend</h1>
          <p className="text-xs text-blue-200 max-w-xl leading-relaxed">
            Lista completa de los 14 requerimientos obligatorios acordados (incluyendo Códigos Promocionales, Flujo Completo Recogida $\rightarrow$ Hub CD $\rightarrow$ Reparto y Generación de Ruta de Recogida).
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex flex-col justify-center">
          <span className="text-3xl font-headline font-extrabold text-flow-secondary font-mono">14 / 14</span>
          <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider mt-1">Requerimientos Listos</span>
          <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
            ✓ 100% Cumplido
          </span>
        </div>
      </div>

      {/* Grid of Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requirementsList.map((req) => (
          <div 
            key={req.num}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-flow-primary hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-slate-100 rounded-2xl border border-slate-200">
                    {req.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Requerimiento #{req.num} • {req.category}
                    </span>
                    <h3 className="text-base font-headline font-bold text-slate-900">{req.title}</h3>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Cubierto
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                "{req.description}"
              </p>

              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-700 block mb-0.5">Implementación Técnica:</span>
                <p>{req.implementation}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => navigate(req.targetPath)}
                className="px-4 py-2 bg-blue-50 hover:bg-flow-primary hover:text-white text-flow-primary text-xs font-bold rounded-xl transition-all flex items-center shadow-sm"
              >
                Probar en Vivo <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
