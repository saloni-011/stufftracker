import { useState, useCallback } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../api';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await getItems(params);
      setItems(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (data) => {
    const res = await createItem(data);
    setItems(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const editItem = useCallback(async (id, data) => {
    const res = await updateItem(id, data);
    setItems(prev => prev.map(i => i.id === id ? res.data : i));
    return res.data;
  }, []);

  const removeItem = useCallback(async (id) => {
    await deleteItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return { items, loading, error, fetchItems, addItem, editItem, removeItem };
}
