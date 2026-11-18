import { useState } from 'react';

export default function ItemForm({ initialData, categories, locations, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    quantity: initialData?.quantity ?? 1,
    categoryId: initialData?.categoryId || '',
    locationId: initialData?.locationId || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    const qty = Number(form.quantity);
    if (!Number.isInteger(qty) || qty < 1) errs.quantity = 'Quantity must be a whole number ≥ 1';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setSaveError('');
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description,
        quantity: Number(form.quantity),
        categoryId: form.categoryId || null,
        locationId: form.locationId || null,
      });
    } catch (err) {
      setSaveError(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-overlay">
      <form className="item-form card" onSubmit={handleSubmit} noValidate>
        <h3>{initialData ? 'Edit Item' : 'Add New Item'}</h3>

        {saveError && <div className="error-banner" style={{marginBottom:'0.75rem'}}>⚠️ {saveError}</div>}

        <div className="form-group">
          <label>Name *</label>
          <input
            className={errors.name ? 'input-error' : ''}
            value={form.name}
            onChange={handle('name')}
            placeholder="e.g. MacBook Pro"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={handle('description')}
            placeholder="Optional description…"
            rows={2}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              min={1}
              className={errors.quantity ? 'input-error' : ''}
              value={form.quantity}
              onChange={handle('quantity')}
            />
            {errors.quantity && <span className="field-error">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={form.categoryId} onChange={handle('categoryId')}>
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <select value={form.locationId} onChange={handle('locationId')}>
              <option value="">— None —</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : initialData ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
