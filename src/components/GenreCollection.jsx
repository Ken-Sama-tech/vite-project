import { useEffect, useState } from 'react';
import OutlinedButton from './buttons/OutlinedButton';
import SubHeading from './texts/SubHeading';
import ErrorOverlay from './overlay/ErrorOverlay';
import { useNavigate } from 'react-router-dom';

function GenreCollection({
  className = '',
  genres = [],
  type = 'anime',
  error = false,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    let timeout;

    if (genres.length <= 0) {
      timeout = setTimeout(() => {
        setHasError(true);
      }, 30000);
    } else {
      clearTimeout(timeout);
      setIsLoading(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [genres, error]);

  return (
    <div
      className={`flex items-center flex-col py-3 px-2 gap-y-2 bg-(--dark) h-auto w-full ${className}`}
    >
      <SubHeading
        text="Browse by Genre"
        loading={isLoading}
        className="!text-2xl w-60"
      />

      {!hasError && (
        <ul className="border-2 border-(--blue) w-full p-5 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2 rounded-sm">
          {isLoading &&
            Array.from({ length: 20 }, (_, idx) => {
              return (
                <li className="h-8" key={idx}>
                  <OutlinedButton className="w-full h-full" />
                </li>
              );
            })}

          {!isLoading && (
            <>
              {genres.map((genre, idx) => {
                return (
                  <li key={idx}>
                    <OutlinedButton
                      name={genre}
                      loading={false}
                      className="!w-full !h-full line-clamp-1"
                      callback={() => {
                        navigate(`${type}/genres?genre=${genre}`);
                        window.scrollTo(0, 0);
                      }}
                    />
                  </li>
                );
              })}
            </>
          )}
        </ul>
      )}

      {hasError && <ErrorOverlay className="!static" />}
    </div>
  );
}

export default GenreCollection;
