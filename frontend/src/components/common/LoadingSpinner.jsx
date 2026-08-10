function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__circle" aria-hidden="true" />
      <span className="loading-spinner__label">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
