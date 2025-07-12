import { AlertTriangle } from 'lucide-react';

function CardErrorOverlay({
  className = '',
  message = ' Failed to load media',
}) {
  return (
    <div
      className={`aspect-[2/3] h-full rounded-lg flex items-center justify-center bg-neutral-800 shadow-[2px_2px_10px_rgba(0,0,0,0.4) ${className}`}
    >
      <div className="flex items-center gap-2 border border-red-400 bg-red-400/10 px-3 py-2 rounded-md">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        <span className="text-sm text-red-100 font-medium">{message}</span>
      </div>
    </div>
  );
}

export default CardErrorOverlay;
