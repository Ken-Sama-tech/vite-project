import { useEffect, useState, useRef } from 'react';
import SubHeading from '../texts/SubHeading';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ErrorOverlay from '../overlay/ErrorOverlay';
import MediaCard from '../cards/MediaCard';

function Slider({
  className = '',
  children = null,
  headers = '',
  hasMore = true,
  goto = '#',
  hasError = false,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const scrollableContainerRef = useRef(null);
  const scrollLeftRef = useRef(null);
  const scrollRightRef = useRef(null);

  useEffect(() => {
    let timeOut;

    if (hasError) {
      setError(true);
      setIsLoading(false);
      return;
    } else {
      timeOut = setTimeout(() => setError(true), 30000);
    }

    if (children.length > 0) {
      setIsLoading(false);
      clearTimeout(timeOut);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [children.length]);

  useEffect(() => {
    if (isLoading) return;

    if (children.length <= 0) {
      setError(true);
      setIsLoading(false);
      return;
    }

    const scrollableContainer = scrollableContainerRef?.current;
    const scrollLeft = scrollLeftRef?.current;
    const scrollRight = scrollRightRef?.current;

    const scrollRightHandler = () => {
      scrollableContainer?.scrollBy({ left: 250, behavior: 'smooth' });
    };

    const scrollLeftHandler = () => {
      scrollableContainer?.scrollBy({ left: -250, behavior: 'smooth' });
    };

    scrollLeft?.addEventListener('click', scrollLeftHandler);
    scrollRight?.addEventListener('click', scrollRightHandler);

    return () => {
      scrollLeft?.removeEventListener('click', scrollLeftHandler);
      scrollRight?.removeEventListener('click', scrollRightHandler);
    };
  }, [isLoading, error]);

  return (
    <section
      aria-label="card slider"
      className={`bg-(--dark) h-[50vh] p-2 flex flex-col relative ${className}`}
    >
      <div className="w-full flex items-center justify-between">
        <SubHeading className="!text-2xl" text={headers} loading={isLoading} />
        {hasMore && (
          <>
            <Link
              to={goto}
              className={`${
                isLoading
                  ? 'skeleton-load py-3 px-10'
                  : 'text-(--blue) font-semibold transition-all duration-200 ease-in hover:underline hover:opacity-90'
              }`}
            >
              {!isLoading && 'See More'}
            </Link>
          </>
        )}
      </div>

      {!error && (
        <>
          <div className="flex relative grow-1 w-full px-10">
            {isLoading && (
              <div className="w-full flex gap-6 px-0 pb-2 pt-3 justify-center">
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
                <MediaCard />
              </div>
            )}
            {!isLoading && (
              <>
                <ul
                  ref={scrollableContainerRef}
                  className="w-full flex snap-x snap-mandatory overflow-y-hidden rm-scrollbar px-0 pb-2 pt-3 gap-6"
                >
                  {children}
                </ul>
                <button
                  ref={scrollRightRef}
                  className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 size-8"
                >
                  <ChevronRight className="h-full w-full text-(--blue)" />
                </button>
                <button
                  ref={scrollLeftRef}
                  className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 size-8"
                >
                  <ChevronLeft className="h-full w-full text-(--blue)" />
                </button>
              </>
            )}
          </div>
        </>
      )}

      {error && <ErrorOverlay />}
    </section>
  );
}

export default Slider;
