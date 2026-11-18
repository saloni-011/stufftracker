import LoadingSpinner from './LoadingSpinner';
import ErrorBanner from './ErrorBanner';
import ItemCard from './ItemCard';

export default function ItemList({ items, categories, locations, onEdit, onDelete, loading, error, onDismissError }) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} onClose={onDismissError} />;

  if (!items.length) {
    return (
      <div className="empty-state">
        <p>📭 No items found.</p>
        <p className="empty-hint">Add your first item using the button above!</p>
      </div>
    );
  }

  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          categories={categories}
          locations={locations}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
