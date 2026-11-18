import { useState, useCallback } from 'react';
import { getLocations, createLocation, deleteLocation } from '../api';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLocations();
      setLocations(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  }, []);

  const addLocation = useCallback(async (data) => {
    const res = await createLocation(data);
    setLocations(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const removeLocation = useCallback(async (id) => {
    await deleteLocation(id);
    setLocations(prev => prev.filter(l => l.id !== id));
  }, []);

  return { locations, loading, error, fetchLocations, addLocation, removeLocation };
}
