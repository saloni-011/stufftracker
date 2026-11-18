export default function ItemCard({ item, categories, locations, onEdit, onDelete }) {
  const category = categories.find((c) => c.id === item.categoryId);
  const location = locations.find((l) => l.id === item.locationId);

  return (
    <div className="item-card card">
      <div className="item-card-header">
        <h4 className="item-name">{item.name}</h4>
        <span className="qty-badge">×{item.quantity}</span>
      </div>

      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      <div className="item-tags">
        {category && <span className="badge badge-blue">🗂 {category.name}</span>}
        {location && <span className="badge badge-green">📍 {location.name}</span>}
        {!category && !location && <span className="badge badge-grey">No tags</span>}
      </div>

      <div className="item-actions">
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
          ✏️ Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)}>
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
