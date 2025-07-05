import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

function ErrorOverlay({ className = '' }) {
  const retryButtonRef = useRef(null);

  useEffect(() => {
    const retryButton = retryButtonRef.current;

    const handleRetry = () => {
      window.location.reload();
    };

    retryButton?.addEventListener('click', handleRetry);

    return () => {
      retryButton?.removeEventListener('click', handleRetry);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 bg-(--dark ) flex items-center justify-center z-20 ${className}`}
    >
      <div className="flex flex-col items-center gap-4 px-6 py-5 border border-red-400 bg-[#2a2a2a] text-red-200 rounded-xl shadow-lg backdrop-blur-md animate-fade-in">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
          <span className="text-sm font-medium">
            Something went wrong. Please try again.
          </span>
        </div>
        <button
          ref={retryButtonRef}
          className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-md transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorOverlay;
