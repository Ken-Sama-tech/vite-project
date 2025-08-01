import { Heart } from 'lucide-react';

function FavoriteBadge({
  className = '',
  favorite = 0,
  loading = true,
  loadStyle = '',
}) {
  return (
    <div
      className={`${
        loading
          ? `skeleton-load px-15 py-3 ${loadStyle}`
          : `w-auto h-8 bg-(--tomato) px-2 py-1 ${className}`
      } rounded-full flex items-center justify-center gap-1`}
    >
      {!loading && (
        <>
          <Heart color="#fff" className="aspect-[1/1] h-full" />
          <span className="text-white font-semibold">{favorite}</span>
        </>
      )}
    </div>
  );
}

export default FavoriteBadge;
