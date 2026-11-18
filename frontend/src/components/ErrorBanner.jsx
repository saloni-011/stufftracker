export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <span>⚠️ {message}</span>
      {onClose && (
        <button className="error-close" onClick={onClose} aria-label="Dismiss error">
          ✕
        </button>
      )}
    </div>
  );
}
