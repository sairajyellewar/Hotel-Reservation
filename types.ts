export interface Hotel {
  id: number;
  name: string;
  address: string;
  description: string;
  rating: number;
  priceRange: string; // e.g., "$$ - $$$"
  imageUrl: string;
  gallery: string[];
  rooms: Room[];
  amenities: ('Free Cancellation' | 'Free Breakfast' | 'Couple Friendly')[];
}

export interface Room {
  id: number;
  hotelId: number;
  type: 'Single' | 'Double' | 'Suite';
  price: number;
  roomNumber: string;
  amenities: string[];
}

export interface Reservation {
  id: string; // Using string for UUID-like behavior
  userId: number;
  roomId: number;
  hotelId: number;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}