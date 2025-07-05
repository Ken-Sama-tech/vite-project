function SubHeading({ className = '', text = '', loading = true }) {
  return (
    <h2
      className={`${
        loading
          ? 'py-4 w-30 skeleton-load'
          : 'text-white font-medium text-md block md:text-lg'
      } ${className}`}
    >
      {!loading && text}
    </h2>
  );
}

export default SubHeading;
