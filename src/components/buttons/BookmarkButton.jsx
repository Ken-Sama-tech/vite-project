import { Bookmark, LucideBookmarkCheck } from 'lucide-react';
import Cache from '../../lib/api/cache';
import { useCallback, useEffect, useMemo, useState } from 'react';
import getCacheUrl from '../../lib/utils/getCacheUrl';

function BookmarkButton({
  className = '',
  loading = true,
  params = {},
  type = 'anime',
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedAnime, setBookmarkedAnime] = useState([]);
  const [url] = useState(() => getCacheUrl(type));

  const cache = useMemo(() => {
    return new Cache({ url: url });
  }, [url]);

  const bookmarkToggle = useCallback(
    (bool, fields = {}) => {
      cache.patch({ ...fields, bookmarked: bool }, (res) => {
        const { error } = res;
        if (error) {
          console.error('Error', res);
        }
      });
    },
    [cache]
  );

  useEffect(() => {
    if (!url) {
      return;
    }
    cache.get((res) => {
      const { data, error } = res;

      if (error) {
        console.error('Error', res);
        return;
      }

      const anime = data
        .filter((item) => item.bookmarked)
        .map((item) => item.id);

      if (anime.includes(params.id)) {
        setIsBookmarked(true);
      }

      setBookmarkedAnime(anime);
    });
  }, [url]);

  useEffect(() => {
    if (bookmarkedAnime.includes(params.id)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [params.id]);

  return (
    <button
      onClick={() => {
        const id = params.id;
        const bool = isBookmarked ? false : true;
        setBookmarkedAnime((prev) =>
          bool ? [...prev, id] : prev.filter((num) => num !== id)
        );
        setIsBookmarked(bool);
        bookmarkToggle(bool, params);
      }}
      className={`${
        loading
          ? 'skeleton-load py-4 px-15'
          : 'py-1 px-2 cursor-pointer border border-white hover:bg-white hover:text-black transition-all duration-200 ease-in'
      } ${className} rounded-sm ${
        isBookmarked ? 'bg-white text-black' : 'text-white'
      }`}
    >
      {!loading && (
        <>
          {isBookmarked ? (
            <span className="flex">
              Bookmarked <LucideBookmarkCheck size={24} />
            </span>
          ) : (
            <span className="flex">
              Bookmark <Bookmark size={24} />
            </span>
          )}
        </>
      )}
    </button>
  );
}

export default BookmarkButton;
