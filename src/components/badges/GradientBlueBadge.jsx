function GradientBlueBadge({ text = '', className = '', loading = true }) {
  return (
    <>
      <div
        className={`${
          loading
            ? 'p-5 w-50 skeleton-load'
            : 'bg-(image:--gradient-blue) py-2 ps-2 pe-15 text-white font-semibold w-auto rounded-lg text-base md:text-xl'
        } ${className}`}
      >
        {!loading && text}
      </div>
    </>
  );
}

export default GradientBlueBadge;
