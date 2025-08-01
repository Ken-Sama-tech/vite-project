import { Star } from 'lucide-react';

function ScoreBadge({ score = 0, className = '', loading = true, loadStyle }) {
  return (
    <div
      className={`${
        loading
          ? `skeleton-load px-15 py-3 ${loadStyle}`
          : `bg-(--gold) h-8 px-2 py-1 ${className}`
      } flex items-center w-auto rounded-full`}
    >
      {!loading && (
        <>
          <Star
            color="#fff"
            strokeWidth={1.5}
            className="h-full aspect-[1/1]"
          />
          <span className="ml-1 text-base font-medium text-white">
            {((score / 100) * 10).toFixed(2)}
          </span>
        </>
      )}
    </div>
  );
}

export default ScoreBadge;
