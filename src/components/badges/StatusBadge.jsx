function StatusBadge({
  status = 'status: ???',
  className = '',
  loading = true,
}) {
  return (
    <div
      className={`${
        loading
          ? 'skeleton-load px-15 py-3'
          : 'bg-(--bright-green) h-8 px-2 py-1'
      } rounded-full ${className}`}
    >
      {!loading && (
        <>
          <span className="text-white font-semibold">{status}</span>
        </>
      )}
    </div>
  );
}

export default StatusBadge;
