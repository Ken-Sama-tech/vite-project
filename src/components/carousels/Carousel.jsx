import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorOverlay from '../overlay/ErrorOverlay';

function Carousel({ renderDecoration, images, className = '', hasError }) {
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (hasError) {
      setError(true);
      return;
    }

    let timeOut;

    if (images.length > 0) {
      const validImages = images.filter(Boolean);
      setCarouselImages(validImages);
      setIsLoading(false);
      setImageCount(validImages.length - 1);
      clearTimeout(timeOut);
    } else {
      setIsLoading(true);
      setImageCount(0);
      timeOut = setTimeout(() => {
        setError(true);
      }, 30000);
    }

    return () => {
      clearTimeout(timeOut);
      setCarouselImages([]);
    };
  }, [images, hasError]);

  useEffect(() => {
    if (imageCount < 1) {
      return;
    }

    let interval;

    const changeCurrentIdx = () => {
      setCurrentIdx((prev) => (prev >= imageCount ? 0 : prev + 1));
    };

    interval = setInterval(changeCurrentIdx, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, currentIdx]);

  return (
    <section
      aria-label="carousel"
      className={`h-[40vh] w-full relative aspect-[2/1] md:h-auto md:aspect-[7/2] shadow-2xl ${className} z-0`}
    >
      {isLoading && !error && (
        <>
          <div className="w-full h-full bg-[rgba(0,0,0,0.3)] absolute hidden md:block">
            <button className="size-10 absolute !rounded-full top-1/2 left-4 -translate-y-1/2 skeleton-load"></button>
            <button className="size-10 absolute !rounded-full top-1/2 right-4 -translate-y-1/2 skeleton-load"></button>
          </div>
          {renderDecoration && !error && renderDecoration(currentIdx, true)}
        </>
      )}

      {!isLoading && !error && (
        <>
          <ul className="h-full w-full absolute">
            {carouselImages.map((image, idx) => {
              return (
                <li
                  key={idx}
                  className={`h-full w-full absolute transition-all duration-200 ease-in-out ${
                    currentIdx === idx
                      ? 'opacity-100 -translate-x-0 z-1'
                      : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={image}
                    className="h-full w-full object-cover z-1"
                    loading="lazy"
                  />
                </li>
              );
            })}
          </ul>

          <div className="w-full h-full bg-[rgba(0,0,0,0.3)] z-2 absolute inset-shadow-[0_-60px_40px_rgba(0,0,0,0.6)]">
            <button
              className="size-10 absolute rounded-full top-1/2 left-[2px] -translate-y-1/2 overflow-hidden cursor-pointer opacity-50 transition-opacity duration-200 ease-in hover:opacity-90 z-3 md:left-1"
              onClick={() =>
                setCurrentIdx((prev) => (prev <= 0 ? imageCount : prev - 1))
              }
            >
              <ChevronLeft
                className="h-full w-full"
                color="#2563eb"
                strokeWidth={3}
              />
            </button>
            <button
              className="size-10 absolute rounded-full top-1/2 right-[2px] -translate-y-1/2 overflow-hidden cursor-pointer opacity-50 transition-opacity duration-200 ease-in hover:opacity-90 z-3 md:right-1"
              onClick={() =>
                setCurrentIdx((prev) => (prev >= imageCount ? 0 : prev + 1))
              }
            >
              <ChevronRight
                className="h-full w-full"
                color="#2563eb"
                strokeWidth={3}
              />
            </button>

            <div className="h-5 w-auto absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 justify-center items-center">
              {carouselImages.map((_, idx) => {
                return (
                  <button
                    className={`size-2 rounded-full cursor-pointer transition-all duration-100 ease-in hover:bg-neutral-300 ${
                      idx == currentIdx ? 'bg-neutral-300' : 'bg-neutral-500'
                    }`}
                    key={idx}
                    title={`image ${idx + 1}`}
                    onClick={() => setCurrentIdx(idx)}
                  ></button>
                );
              })}
            </div>
          </div>
          {renderDecoration && !error && renderDecoration(currentIdx)}
        </>
      )}

      {error && <ErrorOverlay />}
    </section>
  );
}

export default Carousel;
