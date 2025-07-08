import { useEffect, useState } from 'react';
import anilist from '../../../lib/api/anilist';
import { useSearchParams } from 'react-router-dom';
import FilterButton from '../../../components/buttons/FilterButton';
import KebabMenuButton from '../../../components/buttons/KebabMenuButton';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import { useNavigate } from 'react-router-dom';

function BrowseByGenre() {
  const [genres, setGenres] = useState([]);
  const [genresHasError, setGenresHasError] = useState(false);
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState([]);
  const [anime, setAnime] = useState([]);
  const [animeHasError, setAnimeHasError] = useState(false);

  const navigate = useNavigate();
  const genre = searchParams.getAll('genre');

  useEffect(() => {
    anilist.getGenreCollection((res) => {
      const { data, error } = res;

      if (error) {
        console.error('Error:', res);
        setGenresHasError(true);
        return;
      }

      const genres = data?.GenreCollection;
      setGenres(genres);
      console.log(genre);
    });

    setFilter(genre);
  }, []);

  useEffect(() => {
    const formattedFilter = filter.map((item) => `'${item}'`);

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
        mediaParams: { genre_in: formattedFilter },
        limit: 20,
      },
      (res) => {
        const { error, data } = res;

        if (error) {
          console.error('Error', res);
          setAnimeHasError(true);
          return;
        }

        console.log(data);

        const anime = data.Page.media;
        setAnime(anime);
      }
    );
  }, [filter]);

  return (
    <>
      <div className="h-auto py-2 px-1 w-full">
        <div className="h-auto w-full flex items-center justify-end px-2 relative gap-x-1">
          <OutlinedButton
            className="h-8 me-1"
            loading={false}
            name="Save"
            callback={() => {
              navigate(
                `?${filter
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
                setFilter((prev) => [...prev, key]);
              } else {
                setFilter((prev) => prev.filter((item) => item !== key));
              }
            }}
          />

          <KebabMenuButton className="!h-7" />
        </div>
      </div>

      <div className="border border-white"></div>
    </>
  );
}

export default BrowseByGenre;
