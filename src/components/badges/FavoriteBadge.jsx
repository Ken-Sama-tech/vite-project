import { Heart } from 'lucide-react';

function FavoriteBadge({ className = '', favorite = 0, loading = true }) {
  return (
    <div
      className={`${
        loading
          ? 'skeleton-load px-15 py-3'
          : 'w-auto h-8 bg-(--tomato) px-2 py-1'
      } rounded-full flex items-center justify-center gap-1 ${className}`}
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
