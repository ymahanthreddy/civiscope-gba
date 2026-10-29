import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface City {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  radius_km: number;
}

interface CityArea {
  id: string;
  city_id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

interface CityContextType {
  cities: City[];
  selectedCity: City | null;
  cityAreas: CityArea[];
  detectedArea: CityArea | null;
  detectedAreaDistance: number | null;
  userCoords: { lat: number; lng: number } | null;
  accuracy: number | null;
  reverseAddress: string | null;
  loading: boolean;
  locationDetected: boolean;
  locationError: string | null;
  setSelectedCity: (city: City | null) => void;
  setDetectedArea: (area: CityArea | null) => void;
  detectLocation: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [cityAreas, setCityAreas] = useState<CityArea[]>([]);
  const [detectedArea, setDetectedArea] = useState<CityArea | null>(null);
  const [detectedAreaDistance, setDetectedAreaDistance] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [reverseAddress, setReverseAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fetch all cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase.from('cities').select('*').order('name');
      if (data) setCities(data);
      setLoading(false);
    };
    fetchCities();
  }, []);

  // Fetch areas when city changes
  useEffect(() => {
    if (!selectedCity) { setCityAreas([]); setDetectedArea(null); setDetectedAreaDistance(null); return; }
    const fetchAreas = async () => {
      const { data } = await supabase
        .from('city_areas')
        .select('*')
        .eq('city_id', selectedCity.id)
        .order('name');
      const areas = (data || []) as CityArea[];
      setCityAreas(areas);

      // Always pick the nearest area when we have user coords
      if (userCoords && areas.length > 0) {
        let nearest: CityArea | null = null;
        let minDist = Infinity;
        for (const area of areas) {
          if (area.latitude && area.longitude) {
            const dist = haversineDistance(userCoords.lat, userCoords.lng, area.latitude, area.longitude);
            if (dist < minDist) {
              minDist = dist;
              nearest = area;
            }
          }
        }
        if (nearest) {
          setDetectedArea(nearest);
          setDetectedAreaDistance(minDist);
        }
      }
    };
    fetchAreas();
  }, [selectedCity, userCoords]);

  const findNearestCity = useCallback((lat: number, lon: number): City | null => {
    let nearest: City | null = null;
    let minDist = Infinity;
    for (const city of cities) {
      const dist = haversineDistance(lat, lon, city.latitude, city.longitude);
      if (dist < city.radius_km && dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }
    return nearest;
  }, [cities]);

  // Reverse geocode via OpenStreetMap Nominatim (free, no key)
  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data?.display_name) {
        // Compact 3-part address
        const parts = (data.display_name as string).split(',').slice(0, 3).map(s => s.trim());
        setReverseAddress(parts.join(', '));
      }
    } catch { /* silent */ }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setAccuracy(acc);
        reverseGeocode(latitude, longitude);
        const matched = findNearestCity(latitude, longitude);
        if (matched) {
          setSelectedCity(matched);
          setLocationDetected(true);
          setLocationError(null);
        } else {
          setLocationError('Your location is not near any supported city. Please select manually.');
        }
      },
      (error) => {
        setLocationError(
          error.code === 1
            ? 'Location permission denied. Please select your city manually.'
            : 'Could not detect your location. Please select manually.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [findNearestCity, reverseGeocode]);

  // Auto-detect on mount when cities are loaded
  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      detectLocation();
    }
  }, [cities, selectedCity, detectLocation]);

  return (
    <CityContext.Provider value={{
      cities, selectedCity, cityAreas, detectedArea, detectedAreaDistance,
      userCoords, accuracy, reverseAddress, loading, locationDetected, locationError,
      setSelectedCity, setDetectedArea, detectLocation,
    }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
}
