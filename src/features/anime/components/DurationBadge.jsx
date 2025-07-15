import { TimerIcon } from 'lucide-react';

function DurationBadge({
  className = '',
  entry = 'Entry: ??',
  loading = true,
}) {
  return (
    <div
      className={`${
        loading
          ? 'skeleton-load px-15 py-3'
          : `bg-(--blue) text-white flex items-center px-2 py-1 text-nowrap gap-0.5 ${className}`
      }`}
    >
      {!loading && (
        <>
          <TimerIcon className="h-full shrink-0" />
          {entry}
        </>
      )}
    </div>
  );
}

export default DurationBadge;
