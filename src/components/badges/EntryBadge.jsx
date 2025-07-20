function EntryBadge({
  className = '',
  entry = 'Entry: ??',
  loading = true,
  loadStyle = '',
}) {
  return (
    <div
      className={`${
        loading
          ? `skeleton-load px-15 py-3 ${loadStyle}`
          : `bg-(--bright-green) text-white flex items-center rounded-full px-2 py-1 ${className}`
      }`}
    >
      {!loading && entry}
    </div>
  );
}

export default EntryBadge;
