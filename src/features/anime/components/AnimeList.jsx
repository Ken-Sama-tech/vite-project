import { useEffect, useRef, useState } from 'react';
import MediaCard from '../../../components/cards/MediaCard';
import CardContainer from '../../../layouts/CardContainer';
import useObserver from '../../../lib/hooks/useObserver';
import anilist from '../../../lib/api/anilist';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ErrorOverlay from '../../../components/overlay/ErrorOverlay';
import throttle from '../../../lib/utils/throttle';
import { slugify } from '../../../lib/utils/utils';

function AnimeList() {
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAnimeList([]);
    setHasMore(false);
    setCurrentPage(1);
  }, [location.search]);

  const lastVisibleCardRef = useObserver(
    throttle(() => {
      if (!hasMore) return;
      setCurrentPage((prev) => prev + 1);
    }, 500),
    [hasMore]
  );

  useEffect(() => {
    setIsLoading(true);
    const genre = searchParams.getAll('genre');
    const sort = searchParams.getAll('sort');
    const status = searchParams.get('status');

    const params = {};

    if (genre.length) params['genre_in'] = genre.map((g) => `'${g}'`);
    if (status) params['status'] = status;

    params['sort'] = sort.length ? [...sort] : ['SCORE_DESC'];

    anilist.getAnime(
      {
        data: [
          'id',
          { title: ['english', 'romaji', 'native'] },
          { coverImage: ['extraLarge'] },
          { startDate: ['day', 'month', 'year'] },
          { endDate: ['day', 'month', 'year'] },
          'popularity',
          'favourites',
          'meanScore',
          'format',
          'status',
          'episodes',
          'genres',
        ],
        mediaParams: { ...params },
        limit: 30,
        page: currentPage,
        pageInfo: true,
      },
      (res) => {
        const { error, data } = res;

        if (error) {
          console.error('Error', res);
          setError(true);
          return;
        }

        setHasMore(data.Page.pageInfo.hasNextPage);
        setAnimeList((prev) => [...prev, ...data?.Page.media]);
        setIsLoading(false);
      }
    );
  }, [location.search, currentPage]);

  return (
    <>
      {!error && (
        <CardContainer className="!h-full overflow-y-auto rm-scrollbar">
          {animeList.length >= 1 &&
            animeList.map((item, idx) => {
              const title =
                item.title.english || item.title.romaji || item.title.native;
              const start = Object.values(item.startDate)
                .filter(Boolean)
                .map(String)
                .join('/');
              const end = Object.values(item.endDate)
                .filter(Boolean)
                .map(String)
                .join('/');
              const isLast = animeList.length === idx + 1 ? true : false;

              return (
                <li
                  className="max-h-[350px]"
                  key={idx}
                  {...(isLast ? { ref: lastVisibleCardRef } : {})}
                >
                  <MediaCard
                    loading={false}
                    params={{
                      image: item.coverImage.extraLarge,
                      title: title,
                      alt: [item.title.romaji, item.title.native],
                      format: item.format,
                      status: item.status,
                      score: item.meanScore,
                      favorites: item.favourites,
                      entry: `Eps ${item.episodes || '???'}`,
                      aired: `${start} ${end ? `to ${end}` : ''}`,
                      genres: item.genres,
                    }}
                    callback={() => {
                      navigate(`/anime/${item.id}/${slugify(title)}`);
                    }}
                  />
                </li>
              );
            })}

          {isLoading &&
            Array.from({ length: 20 }, (_, idx) => {
              return (
                <li key={idx} className="max-h-[350px]">
                  <MediaCard loading={true} />
                </li>
              );
            })}

          {!isLoading && animeList.length <= 0 && (
            <div className="col-span-6 min-h-dvh">
              <h2 className="text-white font-bold text-3xl text-center w-full">
                No Result Found
              </h2>
            </div>
          )}
        </CardContainer>
      )}
      {error && <ErrorOverlay />}
    </>
  );
}

export default AnimeList;
