function Heading({
  text = 'Heading not Found',
  className = '',
  loading = true,
}) {
  return (
    <h1
      className={`${
        loading
          ? 'py-4 w-70 skeleton-load'
          : 'text-xl text-white font-bold line-clamp-1 md:text-3xl'
      } ${className}`}
    >
      {!loading && text}
    </h1>
  );
}

export default Heading;
