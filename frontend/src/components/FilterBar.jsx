export default function FilterBar({ filters, categories, locations, onChange }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filter-bar">
      <input
        className="filter-input"
        type="text"
        placeholder="🔍 Search items…"
        value={filters.search}
        onChange={handle('search')}
      />
      <select className="filter-select" value={filters.categoryId} onChange={handle('categoryId')}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select className="filter-select" value={filters.locationId} onChange={handle('locationId')}>
        <option value="">All locations</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>
  );
}
