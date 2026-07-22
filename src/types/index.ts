export type UserRole = 'admin' | 'driver' | 'customer' | null;

export type OrderStatus = 'pending' | 'paid' | 'transit' | 'delivered' | 'incident';

export interface Order {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  packageType: string;
  weightKg: number;
  declaredValue: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  currentLocation?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  hubOrigin: string;
  hubDestination: string;
  totalCost: number;
  notes?: string;
  timeline: {
    title: string;
    timestamp: string;
    location: string;
    completed: boolean;
    description?: string;
  }[];
}

export interface DriverStop {
  id: string;
  sequence: number;
  trackingNumber: string;
  recipientName: string;
  address: string;
  city: string;
  phone: string;
  packagesCount: number;
  timeWindow: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'failed';
  notes?: string;
}

export interface DriverRoute {
  id: string;
  driverId: string;
  driverName: string;
  vehiclePlate: string;
  zone: string;
  totalStops: number;
  completedStops: number;
  pendingStops: number;
  totalDistanceKm: number;
  estimatedHours: number;
  stops: DriverStop[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  trackingNumber: string;
  details: string;
}
