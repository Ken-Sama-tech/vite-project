function FormatBadge({ className = '', format = '???', loading = true }) {
  return (
    <div
      className={`${
        loading
          ? 'skeleton-load px-15 py-3'
          : 'bg-(--blue) text-white flex items-center rounded-full px-2 py-1'
      } ${className}`}
    >
      {!loading && format}
    </div>
  );
}

export default FormatBadge;
