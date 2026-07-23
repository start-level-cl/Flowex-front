import type { Order, CustomerProfile } from '../types';

export const mockCustomerProfile: CustomerProfile = {
  id: 'CUST-001',
  name: 'Importaciones Santiago S.A.',
  email: 'contacto@importacionessantiago.cl',
  phone: '+569 8225 7217',
  savedAddresses: [
    { address: 'Av. Providencia 1234, Of. 502', commune: 'Providencia' },
    { address: 'Bodega Central Pudahuel, Módulo 4', commune: 'Pudahuel' }
  ],
  createdBy: 'cliente'
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-84920',
    trackingNumber: 'FX-9842-8812-CL',
    deliveryCode: 'FLW-8225',
    enteredBy: 'cliente',
    customerEmail: 'contacto@importacionessantiago.cl',
    senderName: 'Importaciones Santiago S.A.',
    senderPhone: '+569 8225 7217',
    senderAddress: 'Av. Providencia 1234, Of. 502',
    senderCommune: 'Providencia',
    
    recipientName: 'Carlos Mendoza Ruiz',
    recipientPhone: '+569 8225 7217',
    recipientEmail: 'carlos.mendoza@gmail.com',
    recipientAddress: 'Calle San Martín 842, Dpto 3B',
    recipientCommune: 'Viña del Mar',
    
    packagesCount: 3,
    packageType: 'Caja Grande (Electrónica)',
    weightKg: 4.8,
    declaredValue: 450000,
    insuranceCost: 5500,
    shippingType: 'express',
    
    zone: 'Zona Costa Viña (Z-3)',
    hubName: 'Hub Central Pudahuel',
    hubReceptionAt: '2026-07-21 16:30',
    
    status: 'transit',
    isPaid: true,
    paymentMethod: 'webpay',
    paymentTransactionId: 'TX-WEBPAY-99214',
    paidAt: '2026-07-20 09:35',
    
    promoCode: 'FLOW10',
    discountAmount: 1450,
    originalTotalCost: 14500,

    pickupDriverId: 'DRV-01',
    pickupDriverName: 'Roberto Gómez',
    pickedUpAt: '2026-07-21 11:20',
    pickupPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60',
    pickupNotes: 'Bultos recibidos cerrados y con sello de seguridad.',

    assignedDriverId: 'DRV-01',
    assignedDriverName: 'Roberto Gómez (Furgón KJL-942)',
    
    baseCost: 9000,
    totalCost: 13050,
    
    createdAt: '2026-07-20 09:30',
    estimatedDelivery: '2026-07-22 17:00',
    notes: 'Frágil - Contiene monitores LED.',
    
    eventLogs: [
      { id: 'EV-1', timestamp: '2026-07-20 09:30', user: 'contacto@importacionessantiago.cl', role: 'customer', action: 'Pedido Creado', details: 'Ingresado directamente por cliente con código promocional FLOW10.' },
      { id: 'EV-2', timestamp: '2026-07-20 09:35', user: 'Pasarela Webpay', role: 'Sistema', action: 'Pago Confirmado', details: 'Transacción exitosa TX-WEBPAY-99214 con descuento aplicado.' },
      { id: 'EV-2B', timestamp: '2026-07-21 11:20', user: 'rgomez@flowex.cl', role: 'driver', action: 'Recogida Realizada en Origen', details: 'Driver Roberto Gómez acudió a Av. Providencia 1234 y tomó foto del paquete.' },
      { id: 'EV-2C', timestamp: '2026-07-21 16:30', user: 'operador.hub@flowex.cl', role: 'admin', action: 'Recepción en Hub CD Pudahuel', details: 'Paquete clasificado e ingresado a Hub Central Pudahuel.' },
      { id: 'EV-3', timestamp: '2026-07-22 08:30', user: 'rbarria@flowex.cl', role: 'admin', action: 'Salida del Hub & Asignación Ruta Final', details: 'Asignada Zona Costa Viña (Z-3) a conductor Roberto Gómez para entrega.' },
      { id: 'EV-4', timestamp: '2026-07-22 09:15', user: 'rgomez@flowex.cl', role: 'driver', action: 'Cambio de Estado: En Reparto Final', details: 'Carga escaneada y en ruta de reparto.' }
    ],

    emailNotifications: [
      { id: 'EM-1', timestamp: '2026-07-20 09:31', recipientEmail: 'carlos.mendoza@gmail.com', triggerEvent: 'order_created', subject: 'FlowEx: Tu pedido FX-9842-8812-CL ha sido creado', sent: true, body: 'Hola Carlos, tu paquete enviado por Importaciones Santiago ha sido creado con éxito.' },
      { id: 'EM-2', timestamp: '2026-07-22 09:16', recipientEmail: 'carlos.mendoza@gmail.com', triggerEvent: 'in_transit', subject: 'FlowEx: Tu pedido FX-9842-8812-CL está en camino', sent: true, body: 'Hola Carlos, el repartidor Roberto Gómez tiene tu paquete en camino a Calle San Martín 842.' }
    ],

    whatsappNotifications: [
      {
        id: 'WA-1',
        timestamp: '2026-07-22 09:16',
        recipientPhone: '+56 9 1122 3344',
        triggerEvent: 'in_transit',
        message: '¡Hola Carlos Mendoza! Tu paquete FlowEx FX-9842-8812-CL va en camino a Viña del Mar. Sigue el rastreo en vivo: https://flowex-front.vercel.app/tracking?code=FX-9842-8812-CL',
        sent: true,
        whatsappUrl: 'https://api.whatsapp.com/send?phone=56911223344&text=Hola%20Carlos%20Mendoza'
      }
    ]
  },
  {
    id: 'ORD-84927',
    trackingNumber: 'FX-3391-0021-CL',
    enteredBy: 'cliente',
    customerEmail: 'contacto@importacionessantiago.cl',
    senderName: 'Importaciones Santiago S.A.',
    senderPhone: '+56 9 8765 4321',
    senderAddress: 'Bodega Central Pudahuel, Módulo 4',
    senderCommune: 'Pudahuel',

    recipientName: 'Empresas Soluciones SpA',
    recipientPhone: '+56 9 7711 2233',
    recipientEmail: 'compras@soluciones.cl',
    recipientAddress: 'Av. El Bosque Norte 500',
    recipientCommune: 'Las Condes',

    packagesCount: 4,
    packageType: 'Cajas Medianas (Componentes)',
    weightKg: 6.2,
    declaredValue: 320000,
    insuranceCost: 3700,
    shippingType: 'express',

    zone: 'Zona Santiago Oriente (Z-1)',
    hubName: 'Hub Central Pudahuel',

    status: 'picked_up',
    isPaid: true,
    paymentMethod: 'webpay',
    paymentTransactionId: 'TX-WEBPAY-88102',
    paidAt: '2026-07-22 08:00',

    pickupDriverId: 'DRV-02',
    pickupDriverName: 'Camila Rojas',
    pickedUpAt: '2026-07-22 10:15',
    pickupPhotoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    pickupNotes: 'Recogido directamente en módulo de bodega. Foto tomada por conductora Camila Rojas.',

    baseCost: 7800,
    totalCost: 11500,

    createdAt: '2026-07-22 07:45',
    estimatedDelivery: '2026-07-23 14:00',

    eventLogs: [
      { id: 'EV-70', timestamp: '2026-07-22 07:45', user: 'contacto@importacionessantiago.cl', role: 'customer', action: 'Pedido Creado', details: 'Ingresado por cliente.' },
      { id: 'EV-71', timestamp: '2026-07-22 08:00', user: 'Pasarela Webpay', role: 'Sistema', action: 'Pago Confirmado', details: 'Pagado exitosamente.' },
      { id: 'EV-72', timestamp: '2026-07-22 10:15', user: 'crojas@flowex.cl', role: 'driver', action: 'Recogida Realizada en Origen (Foto Adjunta)', details: 'Conductora Camila Rojas retiró paquete en Pudahuel y subió evidencia fotográfica. Rumbo a Hub CD Pudahuel.' }
    ],

    emailNotifications: [],
    whatsappNotifications: []
  },
  {
    id: 'ORD-84928',
    trackingNumber: 'FX-8812-4439-CL',
    enteredBy: 'vendedor',
    sellerName: 'Rodrigo Vendedor B2B',
    customerEmail: 'libreria@centro.cl',
    senderName: 'Librerías del Centro',
    senderPhone: '+56 9 3344 5566',
    senderAddress: 'Pasaje Ahumada 45',
    senderCommune: 'Santiago',

    recipientName: 'Distribuidora del Norte',
    recipientPhone: '+56 9 9900 1122',
    recipientEmail: 'contacto@disnorte.cl',
    recipientAddress: 'Av. Matta 1200',
    recipientCommune: 'Santiago',

    packagesCount: 2,
    packageType: 'Caja Libros',
    weightKg: 3.0,
    declaredValue: 90000,
    insuranceCost: 1400,
    shippingType: 'normal',

    zone: 'Zona Santiago Centro (Z-2)',
    hubName: 'Hub Central Pudahuel',
    hubReceptionAt: '2026-07-22 11:30',

    status: 'in_hub',
    isPaid: true,
    paymentMethod: 'transfer',
    paymentTransactionId: 'TX-TRF-99401',
    paidAt: '2026-07-22 09:10',

    pickupDriverId: 'DRV-02',
    pickupDriverName: 'Camila Rojas',
    pickedUpAt: '2026-07-22 10:30',

    baseCost: 5000,
    totalCost: 6400,

    createdAt: '2026-07-22 09:00',
    estimatedDelivery: '2026-07-23 12:00',

    eventLogs: [
      { id: 'EV-80', timestamp: '2026-07-22 09:00', user: 'rvendedor@flowex.cl', role: 'admin', action: 'Pedido Creado por Vendedor', details: 'Ingresado por vendedor Rodrigo B2B.' },
      { id: 'EV-81', timestamp: '2026-07-22 10:30', user: 'crojas@flowex.cl', role: 'driver', action: 'Recogido en Origen', details: 'Retirado por Camila Rojas.' },
      { id: 'EV-82', timestamp: '2026-07-22 11:30', user: 'operador.hub@flowex.cl', role: 'admin', action: 'Recepción en Centro de Distribución (Hub)', details: 'Ingresado a bodega Hub CD Pudahuel. Listo para despacho final.' }
    ],

    emailNotifications: [],
    whatsappNotifications: []
  },
  {
    id: 'ORD-84921',
    trackingNumber: 'FX-7721-3094-CL',
    enteredBy: 'vendedor',
    sellerName: 'Rodrigo Vendedor B2B',
    customerEmail: 'libreria@centro.cl',
    senderName: 'Librerías del Centro',
    senderPhone: '+56 9 3344 5566',
    senderAddress: 'Pasaje Ahumada 45',
    senderCommune: 'Santiago',
    
    recipientName: 'Dra. María Elena Torres',
    recipientPhone: '+56 9 5566 7788',
    recipientEmail: 'maria.torres@clinicadevalpo.cl',
    recipientAddress: 'Av. Las Condes 9820, Piso 4',
    recipientCommune: 'Las Condes',
    
    packagesCount: 1,
    packageType: 'Documentación Confidencial',
    weightKg: 0.8,
    declaredValue: 50000,
    insuranceCost: 1000,
    shippingType: 'normal',
    
    zone: 'Zona Santiago Oriente (Z-1)',
    hubName: 'Hub Central Pudahuel',
    
    status: 'delivered',
    isPaid: true,
    paymentMethod: 'transfer',
    paymentTransactionId: 'TX-TRF-44102',
    paidAt: '2026-07-21 11:05',
    
    assignedDriverId: 'DRV-02',
    assignedDriverName: 'Camila Rojas',
    
    baseCost: 4900,
    totalCost: 5900,
    
    createdAt: '2026-07-21 11:00',
    estimatedDelivery: '2026-07-21 16:00',
    notes: 'Entregar en recepción con RUT.',
    
    eventLogs: [
      { id: 'EV-10', timestamp: '2026-07-21 11:00', user: 'rvendedor@flowex.cl', role: 'admin', action: 'Pedido Creado por Vendedor', details: 'Ingresado por vendedor Rodrigo Vendedor B2B.' },
      { id: 'EV-11', timestamp: '2026-07-21 15:45', user: 'crojas@flowex.cl', role: 'driver', action: 'Cambio de Estado: Entregado', details: 'Firma recibida por Recepción Central.' }
    ],

    emailNotifications: [
      { id: 'EM-10', timestamp: '2026-07-21 11:01', recipientEmail: 'maria.torres@clinicadevalpo.cl', triggerEvent: 'order_created', subject: 'FlowEx: Pedido FX-7721-3094-CL recibido', sent: true, body: 'Tu pedido confidencial de Librerías del Centro ha ingresado.' },
      { id: 'EM-11', timestamp: '2026-07-21 15:46', recipientEmail: 'maria.torres@clinicadevalpo.cl', triggerEvent: 'delivered', subject: 'FlowEx: Pedido FX-7721-3094-CL Entregado', sent: true, body: 'Tu pedido ha sido entregado en Av. Las Condes 9820.' }
    ],

    whatsappNotifications: [
      {
        id: 'WA-10',
        timestamp: '2026-07-21 15:46',
        recipientPhone: '+56 9 5566 7788',
        triggerEvent: 'delivered',
        message: '¡Hola Dra. María Elena Torres! Tu pedido FlowEx FX-7721-3094-CL ha sido entregado exitosamente en Av. Las Condes 9820.',
        sent: true
      }
    ]
  },
  {
    id: 'ORD-84922',
    trackingNumber: 'FX-4490-1123-CL',
    enteredBy: 'cliente',
    customerEmail: 'ventas@tecnostore.cl',
    senderName: 'TecnoStore Chile',
    senderPhone: '+56 9 9988 7766',
    senderAddress: 'Av. Apoquindo 4000',
    senderCommune: 'Las Condes',
    
    recipientName: 'Gonzalo Silva Morales',
    recipientPhone: '+56 9 2233 4455',
    recipientEmail: 'gonzalo.silva@gmail.com',
    recipientAddress: 'Calle Freire 541',
    recipientCommune: 'Concepción',
    
    packagesCount: 2,
    packageType: 'Paquete Mediano (Tech)',
    weightKg: 2.3,
    declaredValue: 280000,
    insuranceCost: 3800,
    shippingType: 'normal',
    
    zone: 'Zona Sur Concepción (Z-4)',
    hubName: 'Hub Concepción',
    
    status: 'paid',
    isPaid: true,
    paymentMethod: 'credit_card',
    paymentTransactionId: 'TX-CARD-11029',
    paidAt: '2026-07-22 08:20',
    
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    
    baseCost: 15100,
    totalCost: 18900,
    
    createdAt: '2026-07-22 08:15',
    estimatedDelivery: '2026-07-23 18:00',
    
    eventLogs: [
      { id: 'EV-20', timestamp: '2026-07-22 08:15', user: 'ventas@tecnostore.cl', role: 'customer', action: 'Pedido Creado', details: 'Ingresado por cliente TecnoStore.' },
      { id: 'EV-21', timestamp: '2026-07-22 08:20', user: 'Tarjeta Crédito', role: 'Sistema', action: 'Pago Confirmado', details: 'Pagado exitosamente. Pendiente de asignación de recogida.' }
    ],

    emailNotifications: [
      { id: 'EM-20', timestamp: '2026-07-22 08:21', recipientEmail: 'gonzalo.silva@gmail.com', triggerEvent: 'order_created', subject: 'FlowEx: Confirmación de Envío FX-4490-1123-CL', sent: true, body: 'Tu pedido está listo para salir a Concepción.' }
    ],

    whatsappNotifications: []
  },
  {
    id: 'ORD-84923',
    trackingNumber: 'FX-1102-9988-CL',
    deliveryCode: 'FLW-7217',
    enteredBy: 'vendedor',
    sellerName: 'Marcela Vendedora Zona Sur',
    customerEmail: 'contacto@textilesdelsur.cl',
    senderName: 'Textiles del Sur',
    senderPhone: '+569 8225 7217',
    senderAddress: 'Camino a Melipilla 8900',
    senderCommune: 'Maipú',
    
    recipientName: 'Farmacia Salud y Vida',
    recipientPhone: '+569 8225 7217',
    recipientEmail: 'despacho@farmaciasalud.cl',
    recipientAddress: 'Av. Alemania 1200, Local 4B',
    recipientCommune: 'Temuco',
    
    packagesCount: 10,
    packageType: 'Pallet / Carga Pesada',
    weightKg: 45.0,
    declaredValue: 1200000,
    insuranceCost: 13000,
    shippingType: 'normal',
    
    zone: 'Zona Sur Temuco (Z-5)',
    hubName: 'Hub Temuco',
    
    status: 'incident',
    isPaid: true,
    paymentMethod: 'transfer',
    paymentTransactionId: 'TX-TRF-00129',
    paidAt: '2026-07-19 15:30',
    
    assignedDriverId: 'DRV-03',
    assignedDriverName: 'Juan Pablo Valenzuela',
    
    failedDeliveryReason: 'Destinatario ausente en domicilio (Portón cerrado sin respuesta)',
    failedDeliveryPhotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
    deliveryAttemptsCount: 1,

    baseCost: 29000,
    totalCost: 42000,
    
    createdAt: '2026-07-19 15:20',
    estimatedDelivery: '2026-07-21 12:00',
    notes: 'INCIDENCIA: Intento 1 fallido (Destinatario ausente). Foto de evidencia subida por conductor. En espera de re-intento de entrega.',
    
    eventLogs: [
      { id: 'EV-30', timestamp: '2026-07-19 15:20', user: 'marcela.vendedora@flowex.cl', role: 'admin', action: 'Pedido Creado por Vendedor', details: 'Ingresado por ejecutiva Marcela.' },
      { id: 'EV-31', timestamp: '2026-07-21 11:30', user: 'jvalenzuela@flowex.cl', role: 'driver', action: 'Intento 1 Fallido - Evidencia Fotográfica Adjunta', details: 'Destinatario ausente en domicilio (Portón cerrado). Conductor Juan Pablo Valenzuela subió foto de respaldo. Paquete re-ingresado a la cola para segundo intento.' }
    ],

    emailNotifications: [
      { id: 'EM-30', timestamp: '2026-07-21 11:31', recipientEmail: 'despacho@farmaciasalud.cl', triggerEvent: 'failed', subject: 'FlowEx: Intento 1 de entrega fallido para FX-1102-9988-CL', sent: true, body: 'Hola, el repartidor no encontró respuesta en el domicilio. Se adjunta evidencia fotográfica y el paquete ha vuelto a la cola para un próximo intento de entrega.' }
    ],

    whatsappNotifications: [
      {
        id: 'WA-30',
        timestamp: '2026-07-21 11:31',
        recipientPhone: '+569 8225 7217',
        triggerEvent: 'failed',
        message: 'FlowEx Alertas: Intento de entrega fallido para tu envío FX-1102-9988-CL (Destinatario ausente). Foto de evidencia adjunta. Tu paquete ha vuelto a la cola de entrega.',
        sent: true,
        whatsappUrl: 'https://api.whatsapp.com/send?phone=56982257217&text=FlowEx%20Intento%20de%20entrega%20fallido'
      }
    ]
  },
  {
    id: 'ORD-84924',
    trackingNumber: 'FX-6632-4411-CL',
    enteredBy: 'cliente',
    customerEmail: 'contacto@parisienne.cl',
    senderName: 'Boutique Parisienne',
    senderPhone: '+56 9 7788 9900',
    senderAddress: 'Mall Plaza Norte, Local 210',
    senderCommune: 'Quilicura',
    
    recipientName: 'Constanza Larraín',
    recipientPhone: '+56 9 8899 0011',
    recipientEmail: 'constanza.larrain@gmail.com',
    recipientAddress: 'Av. Valparaíso 340, Reñaca',
    recipientCommune: 'Viña del Mar',
    
    packagesCount: 1,
    packageType: 'Bolsa Segura Vestuario',
    weightKg: 1.2,
    declaredValue: 89000,
    insuranceCost: 1800,
    shippingType: 'express',
    
    zone: 'Zona Costa Viña (Z-3)',
    
    status: 'pending',
    isPaid: false,
    
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    
    baseCost: 5400,
    totalCost: 7200,
    
    createdAt: '2026-07-22 10:05',
    estimatedDelivery: '2026-07-23 15:00',
    
    eventLogs: [
      { id: 'EV-40', timestamp: '2026-07-22 10:05', user: 'contacto@parisienne.cl', role: 'customer', action: 'Pedido Creado', details: 'Ingresado por cliente. Pendiente de pago.' }
    ],

    emailNotifications: [
      { id: 'EM-40', timestamp: '2026-07-22 10:06', recipientEmail: 'constanza.larrain@gmail.com', triggerEvent: 'order_created', subject: 'FlowEx: Tu pedido FX-6632-4411-CL está registrado', sent: true, body: 'Tu pedido de Boutique Parisienne fue registrado y está pendiente de pago.' }
    ],

    whatsappNotifications: []
  }
];
