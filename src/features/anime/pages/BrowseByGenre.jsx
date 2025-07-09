import { useEffect, useState } from 'react';
import anilist from '../../../lib/api/anilist';
import { useSearchParams } from 'react-router-dom';
import FilterButton from '../../../components/buttons/FilterButton';
import KebabMenuButton from '../../../components/buttons/KebabMenuButton';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import { useNavigate } from 'react-router-dom';
import MediaCard from '../../../components/cards/MediaCard';

function BrowseByGenre() {
  const [searchParams] = useSearchParams();
  const genre = searchParams.getAll('genre');

  const [genres, setGenres] = useState([]);
  const [selectedOption, setSelectedOption] = useState(genre || []);
  const [filter, setFilter] = useState(genre || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    setAnime([]);
  }, [filter]);

  useEffect(() => {
    setIsLoading(true);

    const formattedGenre = filter.map((item) => `'${item}'`);
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
        mediaParams: { genre_in: formattedGenre, sort: ['SCORE_DESC'] },
        limit: 20,
        pageInfo: true,
      },
      (res) => {
        const { error, data } = res;

        if (error) {
          console.error('Error', res);
          setError(true);
          return;
        }
        setAnime((prev) => [...prev, ...data?.Page.media]);
        setHasMore(data.Page.pageInfo.hasNextPage);
        setIsLoading(false);
      }
    );
  }, [filter, currentPage]);

  useEffect(() => {
    anilist.getGenreCollection((res) => {
      const { data, error } = res;

      if (error) {
        console.error('Error:', res);
        return;
      }

      const genres = data?.GenreCollection;
      setGenres(genres);
    });

    setSelectedOption(genre);
    setFilter(genre);
  }, []);

  return (
    <>
      <div className="h-auto py-2 px-1 w-full flex flex-col">
        <div className="h-auto w-full flex items-center justify-end px-2 relative gap-x-1">
          <OutlinedButton
            className="h-8 me-1"
            loading={false}
            name="Save"
            callback={() => {
              setFilter([...selectedOption]);
              navigate(
                `/anime/genres?${selectedOption
                  .map((item) => {
                    return `genre=${item}`;
                  })
                  .join('&')}`
              );
            }}
          />

          <FilterButton
            selectedOptions={genre}
            className="mt-1"
            options={genres}
            loading={false}
            callback={(obj) => {
              const key = Object.keys(obj)[0];
              const value = Object.values(obj)[0];

              if (value) {
                setSelectedOption((prev) => [...prev, key]);
              } else {
                setSelectedOption((prev) =>
                  prev.filter((item) => item !== key)
                );
              }
            }}
          />

          <KebabMenuButton className="!h-7" />
        </div>
      </div>
      <ul className="bg-(--dark) w-full list-none grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-3">
        {isLoading &&
          !error &&
          Array.from({ length: 20 }, (item, idx) => {
            return (
              <li key={idx}>
                <MediaCard loading={true} />
              </li>
            );
          })}
        {!isLoading && !error && (
          <>
            {anime.length <= 0 && (
              <div className="col-span-6 min-h-dvh">
                <h2 className="text-white font-bold text-3xl text-center w-full">
                  No Result Found
                </h2>
              </div>
            )}

            {anime.length >= 1 &&
              anime.map((item, idx) => {
                const start = Object.values(item.startDate)
                  .filter(Boolean)
                  .map(String)
                  .join('/');
                const end = Object.values(item.endDate)
                  .filter(Boolean)
                  .map(String)
                  .join('/');
                return (
                  <li key={idx}>
                    <MediaCard
                      loading={false}
                      params={{
                        image: item.coverImage.extraLarge,
                        title:
                          item.title.english ||
                          item.title.romaji ||
                          item.title.native,
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
                        navigate(`/anime?id=${item.id}`);
                      }}
                    />
                  </li>
                );
              })}
          </>
        )}
      </ul>
    </>
  );
}

export default BrowseByGenre;
