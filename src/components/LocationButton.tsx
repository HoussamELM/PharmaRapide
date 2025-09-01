'use client';

import { useState } from 'react';

interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationButtonProps {
  onLocationUpdate?: (address: string) => void;
  compact?: boolean;
}

export default function LocationButton({ onLocationUpdate, compact = false }: LocationButtonProps) {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve(position);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Pharmarapide/1.0'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`Reverse geocoding failed: ${error.message}`);
      }
      throw new Error('Reverse geocoding failed');
    }
  };

  const handleLocationClick = async () => {
    setLoading(true);
    setError(null);
    setLocationData(null);

    try {
      // Step 1: Get current coordinates
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      // Step 2: Get human-readable address
      const address = await reverseGeocode(latitude, longitude);

      // Step 3: Set the location data
      const locationInfo = {
        address,
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      };
      
      setLocationData(locationInfo);
      
      // Call the callback function if provided
      if (onLocationUpdate) {
        onLocationUpdate(address);
      }

    } catch (error) {
      let errorMessage = 'An error occurred while getting your location.';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case 1:
            errorMessage = 'Location access denied. Please allow location access in your browser settings.';
            break;
          case 2:
            errorMessage = 'Location unavailable. Please check your GPS settings and try again.';
            break;
          case 3:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'Unable to get your location. Please try again.';
        }
      } else if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your internet connection and try again.';
        } else if (error.message.includes('Reverse geocoding')) {
          errorMessage = 'Location found but address lookup failed. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${compact ? 'p-4 bg-gray-50 rounded-lg' : 'min-h-[300px] p-6 bg-gray-50 rounded-lg'}`}>
      <div className={`${compact ? 'w-full' : 'max-w-md w-full'} space-y-6`}>
        {/* Header */}
        {!compact && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Location
            </h2>
            <p className="text-gray-600">
              Click the button below to get your current address
            </p>
          </div>
        )}

        {/* Location Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLocationClick}
            disabled={loading}
            className={`
              inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg
              transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              ${loading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Getting Location...
              </>
                         ) : (
               <>
                 <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
                 {compact ? 'Utiliser ma localisation' : 'Get My Location'}
               </>
             )}
          </button>
        </div>

        {/* Location Display */}
        {locationData && !compact && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Your Location
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {locationData.address}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Coordinates: {locationData.coordinates.lat.toFixed(6)}, {locationData.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compact Success Message */}
        {locationData && compact && (
          <div className="mt-2 flex items-center text-sm text-green-600">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Adresse automatiquement remplie !
          </div>
        )}

        {/* Error Display */}
        {error && !locationData && !compact && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Location Error
                </p>
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!compact && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 Make sure to allow location access when prompted by your browser
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 