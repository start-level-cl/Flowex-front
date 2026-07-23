export type UserRole = 'admin' | 'driver' | 'customer';

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'pickup_assigned' 
  | 'picked_up' 
  | 'in_hub' 
  | 'transit' 
  | 'delivered' 
  | 'incident';

export interface PromoCode {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
}

export interface EventLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole | 'Sistema';
  action: string;
  details: string;
}

export interface EmailNotification {
  id: string;
  timestamp: string;
  recipientEmail: string;
  triggerEvent: 'order_created' | 'pickup' | 'hub_reception' | 'in_transit' | 'delivered' | 'failed';
  subject: string;
  body: string;
  sent: boolean;
}

export interface WhatsAppNotification {
  id: string;
  timestamp: string;
  recipientPhone: string;
  triggerEvent: 'order_created' | 'pickup' | 'hub_reception' | 'in_transit' | 'delivered' | 'failed';
  message: string;
  sent: boolean;
  whatsappUrl?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: {
    address: string;
    commune: string;
  }[];
  createdBy: 'cliente' | 'vendedor';
  sellerName?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  // Customer & Seller Metadata
  enteredBy: 'cliente' | 'vendedor';
  sellerName?: string;
  customerEmail: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCommune: string;
  
  // Recipient
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
  recipientCommune: string;
  
  // Package & Coverage
  packagesCount: number;
  packageType: string;
  weightKg: number;
  declaredValue: number;
  insuranceCost: number;
  shippingType: 'normal' | 'express' | 'same_day';
  
  // Automatic Zoning & Hub
  zone: string;
  hubName?: string;
  hubReceptionAt?: string;
  
  // Status & Payment
  status: OrderStatus;
  isPaid: boolean;
  paymentMethod?: 'webpay' | 'credit_card' | 'transfer';
  paymentTransactionId?: string;
  paidAt?: string;
  
  // Promo Code & Discounts
  promoCode?: string;
  discountAmount?: number;
  originalTotalCost?: number;
  
  // Dispatch & Pickup
  pickupDriverId?: string;
  pickupDriverName?: string;
  pickedUpAt?: string;
  pickupPhotoUrl?: string;
  pickupNotes?: string;

  assignedDriverId?: string;
  assignedDriverName?: string;

  // Proof of Delivery & Incidents
  deliveryPhotoUrl?: string;
  deliveryCode?: string;
  failedDeliveryReason?: string;
  failedDeliveryPhotoUrl?: string;
  deliveryAttemptsCount?: number;
  
  // Financials
  baseCost: number;
  totalCost: number;
  
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;

  // Logs & Notifications
  eventLogs: EventLog[];
  emailNotifications: EmailNotification[];
  whatsappNotifications: WhatsAppNotification[];
}

export interface CoverageZone {
  commune: string;
  region: string;
  zoneName: string;
  hasCoverage: boolean;
}
