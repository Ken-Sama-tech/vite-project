import { useEffect, useState } from 'react';
import anilist from '../../../lib/api/anilist';
import { useSearchParams } from 'react-router-dom';
import FilterButton from '../../../components/buttons/FilterButton';
import KebabMenuButton from '../../../components/buttons/KebabMenuButton';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import AnimeList from '../components/AnimeList';
import { useNavigate } from 'react-router-dom';
import SettingsEnum from '../../../components/inputs/SettingsEnum';
import settings from '../../../lib/api/settings';

const addToSettings = [
  <SettingsEnum
    name="sort"
    label="Sort by"
    className="w-1/2"
    useAlias={true}
  />,
];

function BrowseByGenre() {
  const [searchParams] = useSearchParams();
  const genre = searchParams.getAll('genre');
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);
  const [filter, setFilter] = useState(genre || []);

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
  }, []);

  return (
    <>
      <div className="h-full py-2 px-1 w-full relative flex flex-col">
        <div className="h-auto w-full flex items-center justify-end px-2 relative gap-x-1">
          <OutlinedButton
            className="h-8 me-1"
            loading={false}
            name="Save"
            callback={async () => {
              const { data } = await settings.get('sort');
              const sort = data.active === 'NONE' ? '' : `&sort=${data.active}`;
              const genre = filter
                .map((item) => {
                  return `genre=${item}`;
                })
                .join('&');
              navigate(`/anime/genres?${genre}${sort}`);
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
          <KebabMenuButton className="!h-7" AddToMenu={addToSettings} />
        </div>
        <AnimeList />
      </div>
    </>
  );
}

export default BrowseByGenre;
