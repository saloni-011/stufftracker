import { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useCategories';
import ErrorBanner from './ErrorBanner';

export default function CategoryManager() {
  const { categories, loading, error, fetchCategories, addCategory, removeCategory } = useCategories();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Name is required'); return; }
    setNameError('');
    setActionError('');
    try {
      await addCategory({ name: name.trim() });
      setName('');
    } catch (err) {
      setActionError(err.response?.data?.error || err.message || 'Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    setActionError('');
    try {
      await removeCategory(id);
    } catch (err) {
      setActionError(err.response?.data?.error || err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="manager-panel card">
      <h3>🗂 Categories</h3>
      <ErrorBanner message={actionError} onClose={() => setActionError('')} />

      <form className="add-form" onSubmit={handleAdd}>
        <div className="form-group">
          <input
            className={nameError ? 'input-error' : ''}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name…"
          />
          {nameError && <span className="field-error">{nameError}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
      </form>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="muted error-text">⚠️ {error}</p>}

      <ul className="tag-list">
        {categories.map((c) => (
          <li key={c.id} className="tag-item">
            <span className="badge badge-blue">🗂 {c.name}</span>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>✕</button>
          </li>
        ))}
        {!loading && categories.length === 0 && (
          <li className="muted">No categories yet.</li>
        )}
      </ul>
    </div>
  );
}
