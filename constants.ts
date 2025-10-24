import type { Hotel, User } from './types';

export const MOCK_USERS: User[] = [
    { id: 1, username: 'user', fullName: 'Sairaj', role: 'USER' },
    { id: 2, username: 'admin', fullName: 'Admin User', role: 'ADMIN' },
    { id: 3, username: 'sairajyellewar', fullName: 'Sairaj Yellewar', role: 'USER' },
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 1,
    name: 'The Grand Palace',
    address: 'Hyderabad, India',
    description: 'A luxurious stay in the heart of the city, offering unparalleled comfort and breathtaking views. Perfect for business and leisure travelers alike.',
    rating: 4.6,
    priceRange: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop'
    ],
    rooms: [
      { id: 101, hotelId: 1, type: 'Single', price: 150, roomNumber: '101', amenities: ['Wi-Fi', 'TV', 'AC'] },
      { id: 102, hotelId: 1, type: 'Double', price: 250, roomNumber: '102', amenities: ['Wi-Fi', 'TV', 'AC', 'Mini-bar'] },
      { id: 103, hotelId: 1, type: 'Suite', price: 400, roomNumber: '201', amenities: ['Wi-Fi', 'TV', 'AC', 'Mini-bar', 'Jacuzzi'] },
    ],
    amenities: ['Free Breakfast', 'Couple Friendly']
  },
  {
    id: 2,
    name: 'Beachfront Paradise',
    address: 'Goa, India',
    description: 'Wake up to the sound of waves in our stunning beachfront resort. Enjoy private beach access, infinity pools, and world-class dining.',
    rating: 4.8,
    priceRange: '$$$$',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=1935&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop'
    ],
    rooms: [
      { id: 201, hotelId: 2, type: 'Double', price: 350, roomNumber: 'B12', amenities: ['Wi-Fi', 'TV', 'AC', 'Balcony'] },
      { id: 202, hotelId: 2, type: 'Suite', price: 600, roomNumber: 'C-01', amenities: ['Wi-Fi', 'TV', 'AC', 'Mini-bar', 'Ocean View'] },
    ],
    amenities: ['Free Cancellation', 'Couple Friendly']
  },
  {
    id: 3,
    name: 'Mountain Retreat',
    address: 'Shimla, India',
    description: 'Escape the city and find tranquility in our cozy mountain retreat. Perfect for hiking, relaxation, and enjoying the crisp mountain air.',
    rating: 4.5,
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1445019980597-93e09d141a65?q=80&w=1932&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop'
    ],
    rooms: [
      { id: 301, hotelId: 3, type: 'Single', price: 120, roomNumber: 'A1', amenities: ['Wi-Fi', 'Heater', 'Fireplace'] },
      { id: 302, hotelId: 3, type: 'Double', price: 200, roomNumber: 'A2', amenities: ['Wi-Fi', 'Heater', 'Fireplace', 'Mountain View'] },
    ],
    amenities: ['Free Cancellation', 'Free Breakfast']
  },
  {
    id: 4,
    name: 'Urban Modern Loft',
    address: 'Mumbai, India',
    description: 'A stylish and modern hotel in the bustling city center. Ideal for urban explorers who appreciate design and convenience.',
    rating: 4.3,
    priceRange: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1964&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1780&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop'
    ],
    rooms: [
      { id: 401, hotelId: 4, type: 'Double', price: 220, roomNumber: '505', amenities: ['Wi-Fi', 'TV', 'AC', 'Kitchenette'] },
      { id: 402, hotelId: 4, type: 'Suite', price: 380, roomNumber: '801', amenities: ['Wi-Fi', 'Smart TV', 'AC', 'Full Kitchen'] },
    ],
    amenities: ['Couple Friendly']
  }
];