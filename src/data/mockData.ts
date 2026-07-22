import type { Order, DriverRoute, AuditLog } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-84920',
    trackingNumber: 'FX-9842-8812-CL',
    senderName: 'Importaciones Santiago S.A.',
    senderPhone: '+56 9 8765 4321',
    senderAddress: 'Av. Providencia 1234, Of. 502',
    senderCity: 'Santiago',
    recipientName: 'Carlos Mendoza Ruiz',
    recipientPhone: '+56 9 1122 3344',
    recipientAddress: 'Calle San Martín 842, Dpto 3B',
    recipientCity: 'Viña del Mar',
    packageType: 'Caja Grande (Electrónica)',
    weightKg: 4.8,
    declaredValue: 450000,
    status: 'transit',
    createdAt: '2026-07-20 09:30',
    estimatedDelivery: '2026-07-22 17:00',
    currentLocation: 'Hub Centro de Distribución Valparaíso',
    assignedDriverId: 'DRV-01',
    assignedDriverName: 'Roberto Gómez',
    hubOrigin: 'Hub Central Santiago',
    hubDestination: 'Hub Costa Viña',
    totalCost: 14500,
    notes: 'Frágil - Contiene monitor LED 27 pulg.',
    timeline: [
      { title: 'Pedido Creado en Sistema', timestamp: '2026-07-20 09:30', location: 'Santiago HQ', completed: true, description: 'Generación de etiqueta de despacho.' },
      { title: 'Recogido por Transportista', timestamp: '2026-07-20 14:15', location: 'Providencia, Stgo', completed: true, description: 'Retirado por unidad PickUp #04.' },
      { title: 'Ingreso a Hub Central', timestamp: '2026-07-20 18:40', location: 'Hub Central Santiago', completed: true, description: 'Clasificación de paquete automatizada.' },
      { title: 'En Tránsito a Hub Destino', timestamp: '2026-07-21 06:15', location: 'Ruta 68 - Km 45', completed: true, description: 'En camión tramo interurbano.' },
      { title: 'Asignado a Ruta de Reparto', timestamp: '2026-07-22 08:30', location: 'Hub Costa Viña', completed: true, description: 'Asignado al conductor Roberto Gómez.' },
      { title: 'Entregado al Destinatario', timestamp: 'Pendiente (Hoy 16:30 est.)', location: 'Viña del Mar', completed: false, description: 'En camino para entrega final.' }
    ]
  },
  {
    id: 'ORD-84921',
    trackingNumber: 'FX-7721-3094-CL',
    senderName: 'Librerías del Centro',
    senderPhone: '+56 9 3344 5566',
    senderAddress: 'Pasaje Ahumada 45',
    senderCity: 'Santiago',
    recipientName: 'Dra. María Elena Torres',
    recipientPhone: '+56 9 5566 7788',
    recipientAddress: 'Av. Las Condes 9820, Piso 4',
    recipientCity: 'Santiago',
    packageType: 'Documentación Confidencial',
    weightKg: 0.8,
    declaredValue: 50000,
    status: 'delivered',
    createdAt: '2026-07-21 11:00',
    estimatedDelivery: '2026-07-21 16:00',
    currentLocation: 'Entregado - Firma Digital Registrada',
    assignedDriverId: 'DRV-02',
    assignedDriverName: 'Camila Rojas',
    hubOrigin: 'Hub Central Santiago',
    hubDestination: 'Hub Oriente Las Condes',
    totalCost: 5900,
    notes: 'Requiere firma presencial y RUT.',
    timeline: [
      { title: 'Pedido Creado en Sistema', timestamp: '2026-07-21 11:00', location: 'Santiago HQ', completed: true },
      { title: 'Recogido por Courier Express', timestamp: '2026-07-21 12:30', location: 'Santiago Centro', completed: true },
      { title: 'En Reparto Express', timestamp: '2026-07-21 14:10', location: 'Las Condes', completed: true },
      { title: 'Entregado Exitosamente', timestamp: '2026-07-21 15:45', location: 'Av. Las Condes 9820', completed: true, description: 'Recibido por Recepción Central.' }
    ]
  },
  {
    id: 'ORD-84922',
    trackingNumber: 'FX-4490-1123-CL',
    senderName: 'TecnoStore Chile',
    senderPhone: '+56 9 9988 7766',
    senderAddress: 'Av. Apoquindo 4000',
    senderCity: 'Santiago',
    recipientName: 'Gonzalo Silva Morales',
    recipientPhone: '+56 9 2233 4455',
    recipientAddress: 'Calle Freire 541',
    recipientCity: 'Concepción',
    packageType: 'Paquete Mediano',
    weightKg: 2.3,
    declaredValue: 280000,
    status: 'paid',
    createdAt: '2026-07-22 08:15',
    estimatedDelivery: '2026-07-23 18:00',
    currentLocation: 'Hub Central - Listo para Salida Interurbana',
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    hubOrigin: 'Hub Central Santiago',
    hubDestination: 'Hub Sur Concepción',
    totalCost: 18900,
    timeline: [
      { title: 'Pedido Creado y Pagado', timestamp: '2026-07-22 08:15', location: 'Plataforma Web', completed: true },
      { title: 'Ingreso a Almacén Central', timestamp: '2026-07-22 09:40', location: 'Hub Central Santiago', completed: true },
      { title: 'En Espera de Asignación de Camión', timestamp: 'En Proceso', location: 'Hub Central Santiago', completed: false }
    ]
  },
  {
    id: 'ORD-84923',
    trackingNumber: 'FX-1102-9988-CL',
    senderName: 'Textiles del Sur',
    senderPhone: '+56 9 4455 6677',
    senderAddress: 'Camino a Melipilla 8900',
    senderCity: 'Santiago',
    recipientName: 'Farmacia Salud y Vida',
    recipientPhone: '+56 9 6677 8899',
    recipientAddress: 'Av. Alemania 1200',
    recipientCity: 'Temuco',
    packageType: 'Pallet / Carga Pesada',
    weightKg: 45.0,
    declaredValue: 1200000,
    status: 'incident',
    createdAt: '2026-07-19 15:20',
    estimatedDelivery: '2026-07-21 12:00',
    currentLocation: 'Hub Temuco - Dirección Incompleta',
    assignedDriverId: 'DRV-03',
    assignedDriverName: 'Juan Pablo Valenzuela',
    hubOrigin: 'Hub Central Santiago',
    hubDestination: 'Hub Temuco',
    totalCost: 42000,
    notes: 'INCIDENCIA: Teléfono del destinatario no responde. Dirección requiere número de local exacto.',
    timeline: [
      { title: 'Pedido Registrado', timestamp: '2026-07-19 15:20', location: 'Santiago HQ', completed: true },
      { title: 'Traslado Interurbano Completo', timestamp: '2026-07-20 22:00', location: 'Ruta 5 Sur', completed: true },
      { title: 'Intento de Entrega Fallido', timestamp: '2026-07-21 11:30', location: 'Temuco Centro', completed: true, description: 'Dirección sin número de local. Contactando al remitente.' }
    ]
  },
  {
    id: 'ORD-84924',
    trackingNumber: 'FX-6632-4411-CL',
    senderName: 'Boutique Parisienne',
    senderPhone: '+56 9 7788 9900',
    senderAddress: 'Mall Plaza Norte, Local 210',
    senderCity: 'Santiago',
    recipientName: 'Constanza Larraín',
    recipientPhone: '+56 9 8899 0011',
    recipientAddress: 'Av. Valparaíso 340, Reñaca',
    recipientCity: 'Viña del Mar',
    packageType: 'Bolsa Segura Vestuario',
    weightKg: 1.2,
    declaredValue: 89000,
    status: 'pending',
    createdAt: '2026-07-22 10:05',
    estimatedDelivery: '2026-07-23 15:00',
    currentLocation: 'Pendiente de Retiro en Tienda',
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    hubOrigin: 'Hub Norte Santiago',
    hubDestination: 'Hub Costa Viña',
    totalCost: 7200,
    timeline: [
      { title: 'Orden Solicitada', timestamp: '2026-07-22 10:05', location: 'Plataforma Portal', completed: true },
      { title: 'Esperando Confirmación de Pago', timestamp: 'En Proceso', location: 'Pasarela de Pago', completed: false }
    ]
  }
];

export const mockDriverRoute: DriverRoute = {
  id: 'ROUTE-2026-0722-A',
  driverId: 'DRV-01',
  driverName: 'Roberto Gómez',
  vehiclePlate: 'KJL-942 (Furgón Mercedes Sprinter)',
  zone: 'Sector Z-3 (Viña del Mar / Reñaca)',
  totalStops: 5,
  completedStops: 2,
  pendingStops: 3,
  totalDistanceKm: 42.5,
  estimatedHours: 5.5,
  stops: [
    {
      id: 'STOP-01',
      sequence: 1,
      trackingNumber: 'FX-7721-3094-CL',
      recipientName: 'Dra. María Elena Torres',
      address: 'Av. Libertad 450, Of 301',
      city: 'Viña del Mar',
      phone: '+56 9 5566 7788',
      packagesCount: 1,
      timeWindow: '09:00 - 11:00',
      status: 'delivered',
      notes: 'Entregado a recepcionista Gladys.'
    },
    {
      id: 'STOP-02',
      sequence: 2,
      trackingNumber: 'FX-3341-9012-CL',
      recipientName: 'Pedro Alvarado',
      address: 'Calle 1 Norte 1240',
      city: 'Viña del Mar',
      phone: '+56 9 4433 2211',
      packagesCount: 2,
      timeWindow: '11:00 - 12:30',
      status: 'delivered',
      notes: 'Dejar con conserjería.'
    },
    {
      id: 'STOP-03',
      sequence: 3,
      trackingNumber: 'FX-9842-8812-CL',
      recipientName: 'Carlos Mendoza Ruiz',
      address: 'Calle San Martín 842, Dpto 3B',
      city: 'Viña del Mar',
      phone: '+56 9 1122 3344',
      packagesCount: 1,
      timeWindow: '14:00 - 16:00',
      status: 'in_progress',
      notes: 'Llamar antes de subir (Timbre 3B descompuesto).'
    },
    {
      id: 'STOP-04',
      sequence: 4,
      trackingNumber: 'FX-8833-2211-CL',
      recipientName: 'Sofía Balmaceda',
      address: 'Av. Borgoño 14200, Reñaca',
      city: 'Viña del Mar',
      phone: '+56 9 7711 2233',
      packagesCount: 1,
      timeWindow: '16:00 - 17:30',
      status: 'pending',
      notes: 'Condominio Altomar - Torre B'
    },
    {
      id: 'STOP-05',
      sequence: 5,
      trackingNumber: 'FX-6632-4411-CL',
      recipientName: 'Constanza Larraín',
      address: 'Av. Valparaíso 340',
      city: 'Viña del Mar',
      phone: '+56 9 8899 0011',
      packagesCount: 1,
      timeWindow: '17:30 - 18:30',
      status: 'pending'
    }
  ]
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-1092',
    timestamp: '2026-07-22 10:14:22',
    user: 'admin_rbarria@flowex.cl',
    action: 'Asignación de Conductor',
    trackingNumber: 'FX-9842-8812-CL',
    details: 'Asignado vehículo KJL-942 a conductor Roberto Gómez.'
  },
  {
    id: 'LOG-1091',
    timestamp: '2026-07-22 09:40:10',
    user: 'system_sorter',
    action: 'Escaneo en Hub',
    trackingNumber: 'FX-4490-1123-CL',
    details: 'Ingreso verificado en Bahía 4 de Hub Central Santiago.'
  },
  {
    id: 'LOG-1090',
    timestamp: '2026-07-21 15:45:01',
    user: 'driver_crojas',
    action: 'Confirmación de Entrega POD',
    trackingNumber: 'FX-7721-3094-CL',
    details: 'Firma recibida por M. Elena Torres. Foto guardada.'
  },
  {
    id: 'LOG-1089',
    timestamp: '2026-07-21 11:30:19',
    user: 'driver_jvalenzuela',
    action: 'Registro de Incidencia',
    trackingNumber: 'FX-1102-9988-CL',
    details: 'Intento fallido por dirección incompleta (Falta num de local).'
  }
];
