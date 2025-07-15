import ErrorOverlay from '../../components/overlay/ErrorOverlay';
import CardErrorOverlay from '../overlay/CardErrorOverlay';
import { useEffect, useState } from 'react';

function CoverBanner({
  url = '',
  children,
  className = '',
  error = false,
  loading = false,
}) {
  const [hasError, setHasError] = useState(false);
  const [imageNotAvailable, setImageNotAvailable] = useState(false);

  useEffect(() => {
    setHasError(error);
    if (url) return;

    if (!loading && !url) {
      setImageNotAvailable(true);
      return;
    }

    setImageNotAvailable(false);

    let timeout = setTimeout(() => {
      setHasError(true);
    }, 30000);

    return () => {
      clearTimeout(timeout);
    };
  }, [url, error]);

  return (
    <div
      aria-label="banner"
      className={`aspect-[2/1] md:aspect-[7/5] relative w-full h-[40vh] ${className}`}
    >
      {url && (
        <img
          src={url}
          className="size-full object-cover pointer-events-none z-1"
        />
      )}

      {imageNotAvailable && (
        <>
          <div className="relative size-full flex justify-center items-center">
            <CardErrorOverlay
              className="!static !bg-transparent z-3"
              message="Image not available"
            />
          </div>
        </>
      )}

      {hasError && <ErrorOverlay />}

      <div className="size-full z-2 absolute top-0 left-0 bg-[rgba(0,0,0,0.2)]">
        {children}
      </div>
    </div>
  );
}

export default CoverBanner;
