function StatusBadge({
  status = 'status: ???',
  className = '',
  loading = true,
  loadStyle = '',
}) {
  return (
    <div
      className={`${
        loading
          ? `skeleton-load px-15 py-3 ${loadStyle}`
          : 'bg-(--bright-green) h-8 px-2 py-1'
      } rounded-full text-white ${className}`}
    >
      {!loading && status}
    </div>
  );
}

export default StatusBadge;
