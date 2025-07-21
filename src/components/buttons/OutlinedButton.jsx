function OutlinedButton({
  className = '',
  loading = true,
  name = 'button',
  callback = () => {},
  children,
  loadStyle = '',
}) {
  return (
    <button
      title={name}
      onClick={callback}
      className={`${
        loading
          ? `skeleton-load w-25 py-3 !rounded-lg ${loadStyle}`
          : `border border-(--blue) px-2 py-1 text-white rounded-xl cursor-pointer transition-all duration-300 ease-out hover:border-transparent hover:bg-(--elusive-blue) ${className}`
      }`}
    >
      {!loading && (children || name)}
    </button>
  );
}

export default OutlinedButton;
