function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
