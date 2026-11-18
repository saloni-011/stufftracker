import { useState, useEffect, useCallback } from 'react';
import { useItems } from './hooks/useItems';
import { useCategories } from './hooks/useCategories';
import { useLocations } from './hooks/useLocations';
import FilterBar from './components/FilterBar';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import CategoryManager from './components/CategoryManager';
import LocationManager from './components/LocationManager';
import './App.css';

const TABS = [
  { id: 'items', label: '📦 Items' },
  { id: 'categories', label: '🗂 Categories' },
  { id: 'locations', label: '📍 Locations' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('items');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filters, setFilters] = useState({ search: '', categoryId: '', locationId: '' });

  const { items, loading, error, fetchItems, addItem, editItem, removeItem } = useItems();
  const { categories, fetchCategories } = useCategories();
  const { locations, fetchLocations } = useLocations();

  // Load all data on mount
  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchLocations();
  }, [fetchItems, fetchCategories, fetchLocations]);

  // Re-fetch items whenever filters change
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.locationId) params.locationId = filters.locationId;
    fetchItems(params);
  }, [filters, fetchItems]);

  const handleSave = useCallback(async (data) => {
    if (editingItem) {
      await editItem(editingItem.id, data);
    } else {
      await addItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
  }, [editingItem, editItem, addItem]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await removeItem(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1>📦 StuffTracker</h1>
          <p className="subtitle">Your personal inventory tracker</p>
        </div>
      </header>

      <nav className="tab-nav">
        <div className="tab-nav-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'items' && (
          <>
            <div className="items-toolbar">
              <FilterBar
                filters={filters}
                categories={categories}
                locations={locations}
                onChange={setFilters}
              />
              <button
                className="btn btn-primary"
                onClick={() => { setEditingItem(null); setShowForm(true); }}
              >
                ＋ Add Item
              </button>
            </div>

            {showForm && (
              <ItemForm
                initialData={editingItem}
                categories={categories}
                locations={locations}
                onSave={handleSave}
                onCancel={handleCancelForm}
              />
            )}

            <ItemList
              items={items}
              categories={categories}
              locations={locations}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
              error={error}
              onDismissError={() => {}}
            />
          </>
        )}

        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'locations' && <LocationManager />}
      </main>
    </div>
  );
}
