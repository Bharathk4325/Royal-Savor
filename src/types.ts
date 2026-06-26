export type Screen = 'home' | 'menu' | 'reserve' | 'table-select' | 'confirm' | 'admin';

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seating: 'indoor' | 'outdoor';
  environment: 'ac' | 'non-ac';
  occasion: string;
  requests: string;
  tableId: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: string;
}

export interface Table {
  id: string;
  capacity: number;
  location: string;
  status: 'available' | 'reserved' | 'cleaning' | 'vip';
  top: string; // percentage for layout
  left: string; // percentage for layout
  type: 'circle' | 'square' | 'rect';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'south-indian' | 'north-indian' | 'pizza' | 'ice-cream' | 'desserts' | 'beverages';
  image: string;
  isFeatured?: boolean;
}
