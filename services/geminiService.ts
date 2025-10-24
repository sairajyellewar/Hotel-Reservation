import { MOCK_HOTELS, MOCK_USERS } from '../constants';
import type { Hotel, User, Reservation, Room } from '../types';

// Simulate a database of reservations
let mockReservations: Reservation[] = [
    { id: 'res-1672531200000', userId: 1, hotelId: 2, roomId: 201, checkIn: '2024-08-10', checkOut: '2024-08-15', status: 'CONFIRMED' }
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getHotels: async (): Promise<Hotel[]> => {
    await delay(500);
    return MOCK_HOTELS;
  },

  getHotelById: async (id: number): Promise<Hotel | undefined> => {
    await delay(300);
    return MOCK_HOTELS.find(h => h.id === id);
  },

  login: async (username: string): Promise<User | undefined> => {
    await delay(500);
    return MOCK_USERS.find(u => u.username === username);
  },

  getBookingsForUser: async (userId: number): Promise<(Reservation & { hotel: Hotel, room: Room })[]> => {
    await delay(400);
    const userReservations = mockReservations.filter(r => r.userId === userId && r.status === 'CONFIRMED');
    
    return userReservations.map(res => {
        const hotel = MOCK_HOTELS.find(h => h.id === res.hotelId)!;
        const room = hotel.rooms.find(r => r.id === res.roomId)!;
        return { ...res, hotel, room };
    });
  },
  
  createBooking: async (bookingDetails: Omit<Reservation, 'id' | 'status'>): Promise<Reservation> => {
    await delay(700);
    const { roomId, checkIn, checkOut } = bookingDetails;
    
    const isOverlap = mockReservations.some(res => 
      res.roomId === roomId &&
      res.status === 'CONFIRMED' &&
      (new Date(checkIn) < new Date(res.checkOut) && new Date(checkOut) > new Date(res.checkIn))
    );

    if (isOverlap) {
      throw new Error('These dates are unavailable for the selected room.');
    }

    const newReservation: Reservation = {
      ...bookingDetails,
      id: `res-${Date.now()}`,
      status: 'CONFIRMED'
    };
    
    mockReservations.push(newReservation);
    return newReservation;
  },

  cancelBooking: async (reservationId: string): Promise<{ success: boolean }> => {
    await delay(500);
    const reservationIndex = mockReservations.findIndex(r => r.id === reservationId);
    if (reservationIndex !== -1) {
      mockReservations[reservationIndex].status = 'CANCELLED';
      return { success: true };
    }
    throw new Error('Reservation not found.');
  },

  // --- ADMIN FUNCTIONS ---
  addHotel: async (hotelData: Omit<Hotel, 'id' | 'rooms'>): Promise<Hotel> => {
    await delay(600);
    const newHotel: Hotel = {
        ...hotelData,
        id: MOCK_HOTELS.length + 1,
        // Add some default rooms for simplicity
        rooms: [
            { id: (MOCK_HOTELS.length + 1) * 100 + 1, hotelId: MOCK_HOTELS.length + 1, type: 'Double', price: 200, roomNumber: '101', amenities: ['Wi-Fi', 'TV', 'AC'] },
            { id: (MOCK_HOTELS.length + 1) * 100 + 2, hotelId: MOCK_HOTELS.length + 1, type: 'Suite', price: 350, roomNumber: '201', amenities: ['Wi-Fi', 'TV', 'AC', 'Mini-bar'] },
        ]
    };
    MOCK_HOTELS.push(newHotel);
    return newHotel;
  },

  getAllBookings: async (): Promise<(Reservation & { hotel: Hotel, room: Room, user: User })[]> => {
    await delay(500);
    return mockReservations.map(res => {
        const hotel = MOCK_HOTELS.find(h => h.id === res.hotelId)!;
        const room = hotel.rooms.find(r => r.id === res.roomId)!;
        const user = MOCK_USERS.find(u => u.id === res.userId)!;
        return { ...res, hotel, room, user };
    }).sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
  }
};