import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from './services/geminiService';
import HotelCard from './components/Card';
import LoadingSpinner from './components/LoadingSpinner';
import type { Hotel, User, Reservation, Room } from './types';

// --- HELPER ICONS ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const StarIcon = ({ filled, half }: { filled?: boolean, half?: boolean }) => (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
const CheckIcon = () => <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;


// --- TYPE FOR VIEWS ---
type View = 'home' | 'hotel' | 'bookings' | 'login' | 'admin' | 'searchResults';

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userBookings, setUserBookings] = useState<(Reservation & { hotel: Hotel, room: Room })[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);
  
  // --- DATA FETCHING ---
  const fetchHotels = useCallback(() => {
    setIsLoading(true);
    api.getHotels()
      .then(setHotels)
      .catch(() => setError("Could not fetch hotel data."))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const fetchUserBookings = useCallback(async (user: User) => {
    setIsLoading(true);
    try {
      const bookings = await api.getBookingsForUser(user.id);
      setUserBookings(bookings);
    } catch {
      setError("Could not fetch your bookings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- NAVIGATION ---
  const navigateTo = (newView: View) => {
    window.scrollTo(0, 0);
    setView(newView);
    setError(null);
  };
  
  const handleSelectHotel = async (id: number) => {
    setIsLoading(true);
    try {
      const hotel = await api.getHotelById(id);
      if (hotel) {
        setSelectedHotel(hotel);
        navigateTo('hotel');
      } else {
        throw new Error();
      }
    } catch {
      setError("Could not find hotel details.");
      navigateTo('home');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToBookings = () => {
      if (!currentUser) {
          navigateTo('login');
          return;
      }
      fetchUserBookings(currentUser);
      navigateTo('bookings');
  }

  // --- AUTH ---
  const handleLogin = async (username: string) => {
    const user = await api.login(username);
    if (user) {
      setCurrentUser(user);
      navigateTo('home');
    } else {
      setError('Invalid username.');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  // --- BOOKING ---
  const handleBookingConfirmed = (message: string) => {
    if(currentUser) {
        setBookingSuccessMessage(message);
        fetchUserBookings(currentUser);
        navigateTo('bookings');
    }
  }

  // --- RENDER LOGIC ---
  const renderView = () => {
    if (isLoading && !selectedHotel && view !== 'hotel' && view !== 'admin' && view !== 'home' && view !== 'searchResults') return <LoadingSpinner />;
    if (error && view === 'home') return <p className="text-center text-red-500">{error}</p>;

    switch (view) {
      case 'hotel':
        return selectedHotel ? (
          <HotelDetailView
            hotel={selectedHotel}
            user={currentUser}
            onBack={() => navigateTo('searchResults')}
            onLogin={() => navigateTo('login')}
            onBookingConfirmed={handleBookingConfirmed}
          />
        ) : <LoadingSpinner />;
      case 'searchResults':
        return <SearchResultsView hotels={hotels} onSelectHotel={handleSelectHotel} isLoading={isLoading}/>;
      case 'bookings':
          return <BookingsView bookings={userBookings} onCancelBooking={() => fetchUserBookings(currentUser!)} successMessage={bookingSuccessMessage} clearSuccessMessage={() => setBookingSuccessMessage(null)} />;
      case 'login':
        return <LoginView onLogin={handleLogin} error={error} />;
      case 'admin':
        return currentUser?.role === 'ADMIN' ? <AdminDashboard onHotelAdded={fetchHotels} /> : <p>Access Denied</p>;
      case 'home':
      default:
        return <HomeView hotels={hotels} onSelectHotel={handleSelectHotel} isLoading={isLoading} onSearch={() => navigateTo('searchResults')}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header user={currentUser} onLogout={handleLogout} onNavigate={navigateTo} />
      <main>
        {renderView()}
      </main>
      <Footer onNavigate={navigateTo} onGoToBookings={handleGoToBookings} user={currentUser}/>
    </div>
  );
};


// --- SUB-COMPONENTS / VIEWS ---

const Header: React.FC<{ user: User | null; onLogout: () => void; onNavigate: (v: View) => void }> = ({ user, onLogout, onNavigate }) => (
    <header className="bg-white shadow-md sticky top-0 z-20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <button onClick={() => onNavigate('home')} className="font-bold text-3xl text-orange-500">MaxiBooking</button>
                </div>
                <div className="hidden md:block">
                    {user ? (
                        <div className="ml-4 flex items-center md:ml-6">
                            {user.role === 'ADMIN' && (
                                <button onClick={() => onNavigate('admin')} className="mr-4 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                                    Admin
                                </button>
                            )}
                            <span className="text-gray-600">Hello, {user.fullName}</span>
                            <button onClick={onLogout} className="ml-4 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
                                Logout
                            </button>
                        </div>
                    ) : (
                       <button onClick={() => onNavigate('login')} className="ml-4 px-3 py-2 border border-orange-500 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:bg-orange-50">
                           Login / Signup
                       </button>
                    )}
                </div>
            </div>
        </nav>
    </header>
);


const HomeView: React.FC<{hotels: Hotel[], onSelectHotel: (id: number) => void, isLoading: boolean, onSearch: () => void}> = ({ hotels, onSelectHotel, isLoading, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckIn = e.target.value;
        setCheckIn(newCheckIn);
        if (checkOut && new Date(newCheckIn) >= new Date(checkOut)) {
            setCheckOut('');
        }
    };

    const minCheckOutDate = useMemo(() => {
        if (!checkIn) return '';
        const date = new Date(checkIn);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }, [checkIn]);
    
    return (
        <div>
            <div className="relative bg-orange-500 pt-10 pb-20">
                <div className="absolute inset-x-0 bottom-0">
                    <svg viewBox="0 0 224 12" fill="currentColor" className="w-full -mb-1 text-gray-100" preserveAspectRatio="none">
                        <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12 L0,12 L0,0 Z"></path>
                    </svg>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-center text-3xl font-bold text-white mb-6">Book Hotels and Homestays</h1>
                    <div className="bg-white rounded-xl shadow-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-4">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Where to</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Hyderabad"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Check-in</label>
                                <input type="date" value={checkIn} onChange={handleCheckInChange} min={today} className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Check-out</label>
                                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={minCheckOutDate} disabled={!checkIn} className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500 disabled:bg-gray-100"/>
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-sm font-medium text-gray-500 mb-1">Guests & Rooms</label>
                               <input type="text" value="2 Adults | 1 Room" readOnly className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500" />
                            </div>
                        </div>
                        <button onClick={onSearch} className="mt-6 w-full md:w-1/2 mx-auto block bg-orange-500 text-white font-bold text-xl py-3 rounded-full hover:bg-orange-600 shadow-lg">
                            SEARCH
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Recent Searches - Mock */}
                <div className="mb-12">
                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Searches</h2>
                     <div className="bg-white p-4 rounded-lg shadow cursor-pointer border border-gray-200 hover:border-orange-400 w-full max-w-sm">
                        <p className="font-bold text-orange-500">Hyderabad</p>
                        <p className="text-gray-600">Oct 31, 2025 - Nov 1, 2025</p>
                        <p className="text-sm text-gray-500">2 Guests in 1 Room</p>
                     </div>
                </div>
                
                {/* Daily Steal Deals */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Steal Deals</h2>
                    {isLoading ? <LoadingSpinner /> : (
                        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
                           {hotels.map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel} onSelect={onSelectHotel} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const SearchResultsView: React.FC<{hotels: Hotel[], onSelectHotel: (id: number) => void, isLoading: boolean}> = ({ hotels, onSelectHotel, isLoading }) => {
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Filters */}
                <aside className="w-full lg:w-1/4">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2">FILTERS</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Popular filters</h4>
                                    <div className="space-y-2 text-sm">
                                        <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/> <span className="ml-2 text-gray-700">Couple Friendly</span></label>
                                        <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/> <span className="ml-2 text-gray-700">Free Cancellation</span></label>
                                        <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/> <span className="ml-2 text-gray-700">Free Breakfast</span></label>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                     <h4 className="font-semibold mb-2">Price</h4>
                                     <div className="space-y-2 text-sm">
                                        <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/> <span className="ml-2 text-gray-700">$0 to $100</span></label>
                                        <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/> <span className="ml-2 text-gray-700">$100 to $200</span></label>
                                        <label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"/> <span className="ml-2 text-gray-700">$200+</span></label>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                
                {/* Right Column: Hotel Listings */}
                <main className="w-full lg:w-3/4">
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="font-bold">Sort By:</span>
                            <button className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-800 border border-orange-200">Most popular</button>
                            <button className="px-3 py-1 text-sm rounded-full bg-white hover:bg-gray-100 border">Price - Low to high</button>
                            <button className="px-3 py-1 text-sm rounded-full bg-white hover:bg-gray-100 border">Price - High to low</button>
                            <button className="px-3 py-1 text-sm rounded-full bg-white hover:bg-gray-100 border">Rating - Highest First</button>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Showing Properties in Hyderabad</h2>

                    {isLoading ? <LoadingSpinner /> : (
                        <div className="space-y-6">
                           {hotels.map(hotel => (
                                <HotelListItem key={hotel.id} hotel={hotel} onSelect={onSelectHotel} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

const HotelListItem: React.FC<{hotel: Hotel, onSelect: (id: number) => void}> = ({ hotel, onSelect }) => (
    <div onClick={() => onSelect(hotel.id)} className="bg-white rounded-lg shadow-md overflow-hidden flex cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <div className="w-1/3">
             <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
        </div>
        <div className="w-2/3 p-4 flex">
            <div className="flex-grow">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">3★ Hotel</span>
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
                 <div className="flex items-center mt-2">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">{hotel.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-600 ml-2">(3556 Ratings)</span>
                </div>
                <div className="mt-4 space-y-2">
                    {hotel.amenities.map(amenity => (
                        <p key={amenity} className="text-sm text-gray-800 flex items-center"><CheckIcon/> {amenity}</p>
                    ))}
                </div>
            </div>
            <div className="text-right flex flex-col justify-between items-end pl-4 border-l ml-4 min-w-[180px]">
                <div>
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-2 py-1 rounded-md">
                        Bank offer | ₹657 off
                    </div>
                </div>
                <div>
                     <p className="text-gray-500 line-through text-sm">$40</p>
                     <p className="text-2xl font-bold text-gray-900">${hotel.rooms[0].price}</p>
                     <p className="text-xs text-gray-500">+ taxes & fees per night</p>
                </div>
            </div>
        </div>
    </div>
);


const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        if (value <= rating) return 'full';
        if (value - 0.5 <= rating) return 'half';
        return 'empty';
    });
    return (
        <div className="flex items-center">
            {stars.map((type, index) => <StarIcon key={index} filled={type === 'full' || type === 'half'} half={type === 'half'} />)}
        </div>
    );
};

const HotelDetailView: React.FC<{hotel: Hotel, user: User | null, onBack: () => void, onLogin: () => void, onBookingConfirmed: (message: string) => void}> = ({ hotel, user, onBack, onLogin, onBookingConfirmed }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [bookingError, setBookingError] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckIn = e.target.value;
        setCheckIn(newCheckIn);
        // If new check-in date makes checkout date invalid, reset checkout
        if (checkOut && new Date(newCheckIn) >= new Date(checkOut)) {
            setCheckOut('');
        }
    };

    const minCheckOutDate = useMemo(() => {
        if (!checkIn) return ''; // Disabled if no check-in
        const date = new Date(checkIn);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }, [checkIn]);


    const handleProceedToPayment = () => {
        if (!user) { onLogin(); return; }
        
        if (!selectedRoom) {
            setBookingError("Please select a room type.");
            return;
        }
        if (!checkIn || !checkOut) {
            setBookingError("Please select check-in and check-out dates.");
            return;
        }
        if (new Date(checkOut) <= new Date(checkIn)) {
            setBookingError("Check-out date must be after check-in date.");
            return;
        }
        
        setBookingError('');
        setIsPaymentModalOpen(true);
    }
    
    const handleConfirmBookingApiCall = async () => {
        if (!user || !selectedRoom) return;
        try {
            await api.createBooking({ userId: user.id, hotelId: hotel.id, roomId: selectedRoom.id, checkIn, checkOut });
            setIsPaymentModalOpen(false);
            onBookingConfirmed(`Booking confirmed at ${hotel.name} from ${checkIn} to ${checkOut}!`);
        } catch (err: any) {
            throw new Error(err.message || 'Failed to create booking.');
        }
    }


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-sm text-gray-500 mb-4">
                <span className="cursor-pointer hover:underline" onClick={onBack}>Home</span> &gt; 
                <span className="cursor-pointer hover:underline" onClick={onBack}> Hotels in {hotel.address.split(',')[1]?.trim()}</span> &gt; 
                <span className="font-semibold text-gray-700"> {hotel.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-extrabold text-gray-900">{hotel.name}</h1>
                            <StarRating rating={hotel.rating} />
                        </div>
                        <p className="mt-1 text-md text-gray-500">{hotel.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {hotel.gallery[0] && <img src={hotel.gallery[0]} alt="Main hotel view" className="col-span-2 w-full h-96 object-cover rounded-lg" />}
                        {hotel.gallery[1] && <img src={hotel.gallery[1]} alt="Secondary hotel view 1" className="w-full h-64 object-cover rounded-lg" />}
                        {hotel.gallery[2] && <img src={hotel.gallery[2]} alt="Secondary hotel view 2" className="w-full h-64 object-cover rounded-lg" />}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">About Property</h2>
                        <p className="text-gray-700">{hotel.description}</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white p-6 rounded-lg shadow-xl">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in</label>
                                <input type="date" id="checkin" value={checkIn} onChange={handleCheckInChange} min={today} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"/>
                            </div>
                            <div>
                                <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out</label>
                                <input type="date" id="checkout" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={minCheckOutDate} disabled={!checkIn} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-orange-500 focus:border-orange-500"/>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {hotel.rooms.map(room => (
                                <div key={room.id} className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedRoom?.id === room.id ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-orange-400'}`} onClick={() => setSelectedRoom(room)}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{room.type} Room</h3>
                                            <p className="text-sm text-gray-500">{room.amenities.join(', ')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-xl text-gray-900">${room.price}</p>
                                            <p className="text-sm font-normal text-gray-500">/night</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {bookingError && <p className="text-red-500 text-center mt-4">{bookingError}</p>}
                        <button onClick={handleProceedToPayment} className="mt-6 w-full bg-orange-500 text-white font-bold text-lg py-3 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400">
                            {user ? 'Book this now' : 'Login to Book'}
                        </button>
                    </div>
                </div>
            </div>
             {selectedRoom && (
                <PaymentModal 
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onConfirm={handleConfirmBookingApiCall}
                    hotel={hotel}
                    room={selectedRoom}
                    checkIn={checkIn}
                    checkOut={checkOut}
                />
            )}
        </div>
    );
}

const PaymentModal: React.FC<{ isOpen: boolean, onClose: () => void, onConfirm: () => Promise<void>, hotel: Hotel, room: Room, checkIn: string, checkOut: string }> = ({ isOpen, onClose, onConfirm, hotel, room, checkIn, checkOut }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const diffTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
        const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return calculatedNights > 0 ? calculatedNights : 0;
    }, [checkIn, checkOut]);

    const totalPrice = nights * room.price;

    const handlePayment = async () => {
        setIsProcessing(true);
        setPaymentError('');
        try {
            await onConfirm();
        } catch (err: any) {
            setPaymentError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
                    <button onClick={onClose}><XIcon /></button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">{hotel.name}</h3>
                        <p className="text-gray-600">{room.type} Room</p>
                        <p className="text-gray-600 text-sm">{checkIn} to {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="flex justify-between font-bold text-xl">
                            <span>Total Price:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Card Number</label>
                            <input type="text" placeholder="**** **** **** 1234" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input type="text" placeholder="MM/YY" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">CVC</label>
                                <input type="text" placeholder="123" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </div>
                    {paymentError && <p className="text-red-500 text-center mt-4">{paymentError}</p>}
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg">
                    <button onClick={handlePayment} disabled={isProcessing || nights <= 0} className="w-full bg-orange-500 text-white font-bold text-lg py-3 rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-400">
                        {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

const BookingsView: React.FC<{bookings: (Reservation & { hotel: Hotel, room: Room })[], onCancelBooking: () => void, successMessage: string | null, clearSuccessMessage: () => void}> = ({ bookings, onCancelBooking, successMessage, clearSuccessMessage }) => {
    
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => clearSuccessMessage(), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, clearSuccessMessage]);
    
    const handleCancel = async (id: string) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            await api.cancelBooking(id);
            onCancelBooking();
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
                    <p className="font-bold">Success</p>
                    <p>{successMessage}</p>
                </div>
            )}
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            {bookings.length === 0 ? (
                 <div className="text-center p-8 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
                    <p className="text-gray-600">You haven't made any reservations. Start by finding a hotel!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-4">
                        <img src={booking.hotel.imageUrl} alt={booking.hotel.name} className="w-full sm:w-48 h-32 object-cover rounded-md"/>
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold">{booking.hotel.name}</h2>
                            <p className="text-gray-600">{booking.room.type} Room</p>
                            <p className="font-semibold mt-2">Check-in: {booking.checkIn}</p>
                            <p className="font-semibold">Check-out: {booking.checkOut}</p>
                        </div>
                        <div className="flex sm:flex-col justify-end items-end gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">{booking.status}</span>
                                <button onClick={() => handleCancel(booking.id)} className="mt-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600">Cancel</button>
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const LoginView: React.FC<{ onLogin: (username: string) => void; error: string | null; }> = ({ onLogin, error }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username) onLogin(username);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <p className="text-center text-gray-500 mb-4">Use 'user', 'admin', or 'sairajyellewar' to log in.</p>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600">
                    Login
                </button>
            </form>
        </div>
    );
};

const AdminDashboard: React.FC<{onHotelAdded: () => void}> = ({ onHotelAdded }) => {
    const [allBookings, setAllBookings] = useState<(Reservation & { hotel: Hotel, room: Room, user: User })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'bookings' | 'add_hotel'>('bookings');

    const [hotelName, setHotelName] = useState('');
    const [hotelAddress, setHotelAddress] = useState('');
    const [hotelDescription, setHotelDescription] = useState('');
    const [hotelRating, setHotelRating] = useState('4.5');
    const [hotelPriceRange, setHotelPriceRange] = useState('$$$');
    const [hotelImageUrl, setHotelImageUrl] = useState('');

    const fetchAllBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const bookings = await api.getAllBookings();
            setAllBookings(bookings);
        } catch (error) {
            console.error("Failed to fetch all bookings", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (view === 'bookings') {
            fetchAllBookings();
        }
    }, [view, fetchAllBookings]);
    
    const handleAddHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.addHotel({ 
                name: hotelName, 
                address: hotelAddress, 
                description: hotelDescription, 
                rating: parseFloat(hotelRating),
                priceRange: hotelPriceRange,
                imageUrl: hotelImageUrl,
                gallery: [hotelImageUrl],
                amenities: ['Free Breakfast'] // Default amenity
            });
            alert('Hotel added successfully!');
            onHotelAdded(); // Refresh hotel list on home page
            setView('bookings'); // Go back to bookings view
        } catch (error) {
            alert('Failed to add hotel.');
        }
    };

    if (isLoading) return <LoadingSpinner message="Loading Admin Data..." />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="flex border-b mb-6">
                <button onClick={() => setView('bookings')} className={`px-4 py-2 ${view === 'bookings' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}>All Bookings</button>
                <button onClick={() => setView('add_hotel')} className={`px-4 py-2 ${view === 'add_hotel' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500'}`}>Add Hotel</button>
            </div>

            {view === 'bookings' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">All System Bookings</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allBookings.map(b => (
                                    <tr key={b.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.hotel.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.user.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.checkIn} to {b.checkOut}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'add_hotel' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
                    <form onSubmit={handleAddHotel} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Hotel Name" value={hotelName} onChange={e => setHotelName(e.target.value)} required className="w-full p-2 border rounded"/>
                            <input type="text" placeholder="Address (City, Country)" value={hotelAddress} onChange={e => setHotelAddress(e.target.value)} required className="w-full p-2 border rounded"/>
                        </div>
                        <textarea placeholder="Description" value={hotelDescription} onChange={e => setHotelDescription(e.target.value)} required className="w-full p-2 border rounded" rows={4}></textarea>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="number" step="0.1" placeholder="Rating (e.g., 4.5)" value={hotelRating} onChange={e => setHotelRating(e.target.value)} required className="w-full p-2 border rounded"/>
                            <input type="text" placeholder="Price Range (e.g., $$$)" value={hotelPriceRange} onChange={e => setHotelPriceRange(e.target.value)} required className="w-full p-2 border rounded"/>
                        </div>
                        <input type="url" placeholder="Image URL" value={hotelImageUrl} onChange={e => setHotelImageUrl(e.target.value)} required className="w-full p-2 border rounded"/>
                        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600">Add Hotel</button>
                    </form>
                </div>
            )}
        </div>
    );
};


const Footer: React.FC<{onNavigate: (v: View) => void, onGoToBookings: () => void, user: User | null}> = ({ onNavigate, onGoToBookings, user }) => (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
            <button onClick={() => onNavigate('home')} className="flex flex-col items-center text-gray-600 hover:text-orange-600">
                <HomeIcon />
                <span className="text-xs">Home</span>
            </button>
             <button onClick={onGoToBookings} className="flex flex-col items-center text-gray-600 hover:text-orange-600">
                <CalendarIcon />
                <span className="text-xs">Bookings</span>
            </button>
            <button onClick={() => user ? {} : onNavigate('login')} className="flex flex-col items-center text-gray-600 hover:text-orange-600">
                <UserIcon />
                <span className="text-xs">{user ? user.username : 'Login'}</span>
            </button>
        </div>
    </footer>
);


export default App;