import { useState, useCallback } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (data) => {
    const res = await createCategory(data);
    setCategories(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const removeCategory = useCallback(async (id) => {
    await deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return { categories, loading, error, fetchCategories, addCategory, removeCategory };
}
