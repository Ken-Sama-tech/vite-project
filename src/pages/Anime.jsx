import MainLayout from '../layouts/MainLayout';
import anilist from '../lib/api/anilist';
import Carousel from '../components/carousels/Carousel';
import { useEffect, useState } from 'react';
import SubHeading from '../components/texts/SubHeading';
import GradientBlueBadge from '../components/badges/GradientBlueBadge';
import Heading from '../components/texts/Heading';
import ShowDetailButton from '../components/buttons/ShowDetailButton';
import BookmarkButton from '../components/buttons/BookmarkButton';
import Slider from '../components/carousels/Slider';
import MediaCard from '../components/cards/MediaCard';
import ScoreBadge from '../components/badges/ScoreBadge';
import FavoriteBadge from '../components/badges/FavoriteBadge';
import StatusBadge from '../components/badges/StatusBadge';
import GenreCollection from '../components/GenreCollection';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../lib/utils/utils';

function Anime() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselHasError, setCarouselHasError] = useState(false);
  const [carouselDecs, setCarouselDecs] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [trendingHasError, setTrendingHasError] = useState(false);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [upcomingHasError, setUpcomingHasError] = useState(false);
  const [top100, setTop100] = useState([]);
  const [top100HasError, setTop100HasError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genresHasError, setGenresHasError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    //carousel contents
    anilist.getAnime(
      {
        data: [
          'id',
          { title: ['english', 'romaji', 'native'] },
          'bannerImage',
          'description',
          'meanScore',
          'popularity',
          'favourites',
          'status',
          { coverImage: ['extraLarge'] },
        ],
        mediaParams: {
          sort: 'POPULARITY_DESC',
        },
        limit: 5,
      },
      (res) => {
        const { data, error } = res;
        if (error) {
          console.error('Error', res);
          setCarouselHasError(true);
          return;
        }

        const decorations = data.Page.media;

        const images = data.Page.media.map((item) => {
          return item.bannerImage;
        });

        setCarouselImages(images);
        setCarouselDecs(decorations);
      }
    );

    //trending anime
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
        mediaParams: { sort: 'TRENDING_DESC' },
        limit: 20,
      },
      (res) => {
        const { error, data } = res;

        if (error) {
          console.error('Error', res);
          setTrendingHasError(true);
          return;
        }

        const trending = data.Page.media;
        setTrendingAnime(trending);
      }
    );

    //upcoming anime
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
          'genres',
        ],
        mediaParams: {
          status: 'NOT_YET_RELEASED',
          sort: ['POPULARITY_DESC'],
        },
        limit: 20,
      },
      (res) => {
        const { error, data } = res;

        if (error) {
          console.error('Error', res);
          setUpcomingHasError(true);
          return;
        }

        const upcoming = data.Page.media;
        setUpcomingAnime(upcoming);
      }
    );

    //top 100
    anilist.getAnime(
      {
        data: [
          'id',
          { title: ['english', 'romaji', 'native'] },
          { coverImage: ['extraLarge'] },
          { startDate: ['day', 'month', 'year'] },
          { endDate: ['day', 'month', 'year'] },
          'episodes',
          'popularity',
          'favourites',
          'meanScore',
          'format',
          'status',
          'genres',
        ],
        mediaParams: {
          sort: ['SCORE_DESC'],
        },
        limit: 20,
      },
      (res) => {
        const { error, data } = res;

        if (error) {
          console.error('Error', res);
          setTop100HasError(true);
          return;
        }

        const top100 = data.Page.media;
        setTop100(top100);
      }
    );

    anilist.getGenreCollection((res) => {
      const { data, error } = res;

      if (error) {
        console.error(res);
        setGenresHasError(true);
        return;
      }

      const genres = data.GenreCollection;
      setGenres(genres);
    });
  }, []);

  return (
    <MainLayout>
      <Carousel
        className="!h-[50vh] !shadow-[10px_0_50px_rgba(0,0,0,0.5))]"
        images={carouselImages}
        hasError={carouselHasError}
        renderDecoration={(idx, isLoading) => {
          const dec = carouselDecs[idx];
          const title =
            dec?.title.english || dec?.title.romaji || dec?.title.native;
          return (
            <div className="absolute h-[90%] w-[80%] flex flex-col items-start top-0 left-1/2 -translate-x-1/2 md:w-[85%] z-3">
              <GradientBlueBadge
                className="!mt-2 md:!mt-5"
                text={`#${idx + 1} Most Popular`}
                loading={isLoading ? true : false}
              />
              <Heading
                className="mt-2 md:mt-5"
                text={title}
                loading={isLoading ? true : false}
              ></Heading>
              <span className="flex gap-2 line-clamp-1">
                <SubHeading
                  className="mt-1 md:mt-2 italic"
                  text={dec?.title.romaji}
                  loading={isLoading ? true : false}
                />
                <SubHeading
                  className="mt-1 md:mt-2 italic"
                  text={dec?.title.native}
                  loading={isLoading ? true : false}
                />
              </span>

              <p
                className={`${
                  isLoading
                    ? 'skeleton-load p-10'
                    : 'text-white line-clamp-3 text-sm'
                }   mt-2 w-full md:w-[50%] md:mt-5`}
              >
                {!isLoading && dec?.description}
              </p>

              <div
                className={`${
                  isLoading ? 'skeleton-load w-[30%] py-6' : 'h-auto w-auto'
                } mt-2 md:mt-5 flex gap-1`}
              >
                {!isLoading && (
                  <>
                    <ScoreBadge loading={false} score={dec?.meanScore} />
                    <FavoriteBadge loading={false} favorite={dec?.favourites} />
                    <StatusBadge loading={false} status={dec?.status} />
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-2 md:mt-5">
                <ShowDetailButton
                  loading={isLoading ? true : false}
                  goto={`anime/${dec?.id}/${slugify(title)}`}
                />
                <BookmarkButton
                  loading={isLoading ? true : false}
                  type="anime"
                  params={{
                    id: dec?.id,
                    title: title,
                    alternative: [dec?.title.romaji, dec?.title.native],
                    imageUrl: dec?.coverImage.extraLarge,
                  }}
                />
              </div>
            </div>
          );
        }}
      />
      <Slider
        hasError={trendingHasError}
        className="mt-5"
        headers="Trending Now"
        goto="/anime?sort=TRENDING_DESC"
      >
        {trendingAnime.map((item, idx) => {
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

          return (
            <li key={idx}>
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
                  navigate(`anime/${item.id}/${slugify(title)}`);
                }}
              />
            </li>
          );
        })}
      </Slider>
      <Slider
        className="mt-5"
        hasError={upcomingHasError}
        goto="/anime?sort=POPULARITY_DESC&status=NOT_YET_RELEASED"
        headers="Top Upcoming"
      >
        {upcomingAnime.map((item, idx) => {
          const title =
            item.title.english || item.title.romaji || item.title.native;
          return (
            <li key={idx}>
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
                  genres: item.genres,
                }}
                callback={() => {
                  navigate(`anime/${item.id}/${slugify(title)}`);
                }}
              />
            </li>
          );
        })}
      </Slider>
      <Slider
        hasError={top100HasError}
        className="mt-5"
        headers="Top Anime"
        goto="/anime?sort=SCORE_DESC"
      >
        {top100.map((item, idx) => {
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
          return (
            <li key={idx}>
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
                  navigate(`anime/${item.id}/${slugify(title)}`);
                }}
              />
            </li>
          );
        })}
      </Slider>

      <GenreCollection genres={genres} error={genresHasError} type="anime" />
    </MainLayout>
  );
}

export default Anime;
