import { useState, useEffect } from 'react';
import { useLocations } from '../hooks/useLocations';
import ErrorBanner from './ErrorBanner';

export default function LocationManager() {
  const { locations, loading, error, fetchLocations, addLocation, removeLocation } = useLocations();
  const [form, setForm] = useState({ name: '', description: '' });
  const [nameError, setNameError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setNameError('Name is required'); return; }
    setNameError('');
    setActionError('');
    try {
      await addLocation({ name: form.name.trim(), description: form.description });
      setForm({ name: '', description: '' });
    } catch (err) {
      setActionError(err.response?.data?.error || err.message || 'Failed to add location');
    }
  };

  const handleDelete = async (id) => {
    setActionError('');
    try {
      await removeLocation(id);
    } catch (err) {
      setActionError(err.response?.data?.error || err.message || 'Failed to delete location');
    }
  };

  return (
    <div className="manager-panel card">
      <h3>📍 Locations</h3>
      <ErrorBanner message={actionError} onClose={() => setActionError('')} />

      <form className="add-form add-form-col" onSubmit={handleAdd}>
        <div className="form-group">
          <input
            className={nameError ? 'input-error' : ''}
            value={form.name}
            onChange={handle('name')}
            placeholder="Location name…"
          />
          {nameError && <span className="field-error">{nameError}</span>}
        </div>
        <div className="form-group">
          <input
            value={form.description}
            onChange={handle('description')}
            placeholder="Description (optional)…"
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Location</button>
      </form>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="muted error-text">⚠️ {error}</p>}

      <ul className="tag-list">
        {locations.map((l) => (
          <li key={l.id} className="tag-item">
            <div>
              <span className="badge badge-green">📍 {l.name}</span>
              {l.description && <span className="muted" style={{marginLeft:'0.5rem', fontSize:'0.8rem'}}>{l.description}</span>}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}>✕</button>
          </li>
        ))}
        {!loading && locations.length === 0 && (
          <li className="muted">No locations yet.</li>
        )}
      </ul>
    </div>
  );
}
