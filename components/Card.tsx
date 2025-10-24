import React from 'react';
import type { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (id: number) => void;
}

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  return (
    <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex-shrink-0 w-80"
        onClick={() => onSelect(hotel.id)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${hotel.name}`}
        onKeyPress={(e) => e.key === 'Enter' && onSelect(hotel.id)}
    >
        <div className="relative h-56">
            <img 
                className="w-full h-full object-cover" 
                src={hotel.imageUrl} 
                alt={`Exterior of ${hotel.name}`} 
            />
            <div className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 text-sm font-semibold text-gray-800 flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span>{hotel.rating}</span>
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 truncate">{hotel.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
            <p className="text-right text-lg font-semibold text-orange-500 mt-2">{hotel.priceRange}</p>
        </div>
    </div>
  );
};

export default HotelCard;