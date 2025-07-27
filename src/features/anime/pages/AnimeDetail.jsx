import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import anilist from '../../../lib/api/anilist';
import {
  formatArrToString,
  formatDate,
  formatTimestamp,
  slugify,
} from '../../../lib/utils/utils';
import CoverBanner from '../../../components/banners/CoverBanner';
import ImageCard from '../../../components/cards/ImageCard';
import FavoriteBadge from '../../../components/badges/FavoriteBadge';
import FormatBadge from '../../../components/badges/FormatBadge';
import GradientBlueBadge from '../../../components/badges/GradientBlueBadge';
import ScoreBadge from '../../../components/badges/ScoreBadge';
import EntryBadge from '../../../components/badges/EntryBadge';
import Heading from '../../../components/texts/Heading';
import BookmarkButton from '../../../components/buttons/BookmarkButton';
import DurationBadge from '../components/DurationBadge';
import ErrorOverlay from '../../../components/overlay/ErrorOverlay';
import { useNavigate } from 'react-router-dom';
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import { PlayCircle } from 'lucide-react';

function AnimeDetail() {
  const params = useParams();

  const [details, setDetails] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const synopsisRef = useCallback(
    (node) => {
      if (!node) return;
      node.innerHTML = details?.description;
    },
    [details.description]
  );

  useEffect(() => {
    const idMal = params.id;

    anilist.getAnime(
      {
        data: [
          'id',
          'format',
          'meanScore',
          'favourites',
          'updatedAt',
          'duration',
          'episodes',
          'status',
          'genres',
          'season',
          {
            params: {
              studios: {
                isMain: true,
              },
            },
            title: ['english', 'romaji', 'native'],
            coverImage: ['extraLarge'],
            tags: ['name'],
            startDate: ['day', 'month', 'year'],
            endDate: ['day', 'month', 'year'],
            studios: [{ nodes: ['name'] }],
          },
          'bannerImage',
          'description',
        ],
        mediaParams: { id: idMal },
      },
      (res) => {
        const { data, error } = res;
        setIsLoading(false);
        if (error) {
          console.error(res);
          setHasError(true);
          navigate('/error/network');
          return;
        }

        setDetails(data.Page.media[0]);
      }
    );
  }, []);

  return (
    <main className="size-auto grid grid-cols-4">
      <section className="col-span-4 flex flex-wrap h-auto">
        <CoverBanner
          url={details?.bannerImage}
          error={hasError}
          loading={isLoading}
        >
          <ImageCard
            className="absolute top-full left-5 mt-5 !h-[250px] sm:!h-[280px] md:!h-[300px] z-3 md:top-1/2 md:left-5 md:mt-0"
            url={details?.coverImage?.extraLarge}
            loading={isLoading}
            error={hasError}
          />
        </CoverBanner>

        <div className="w-full h-auto flex py-1">
          <div className="relative shrink-0 h-80 w-52 sm:h-87 sm:w-57 md:w-60 md:h-51">
            <BookmarkButton
              className="!flex !justify-center w-[82%] absolute bottom-2 left-1/2 -translate-x-1/2 md:w-[85%]"
              type="anime"
              loading={isLoading}
              params={{
                id: details?.id,
                title:
                  details?.title?.english ||
                  details?.title?.romaji ||
                  details?.title?.native,
                alternative: [details?.title?.romaji, details?.title?.native],
                imageUrl: details?.coverImage?.extraLarge,
              }}
            />
          </div>
          <div className="max-h-80 grow-1 flex flex-col gap-y-2 justify-start items-start sm:max-h-87 md:items-start md:max-h-51">
            <div className="w-full h-full gap-2 flex flex-col items-start p-2 ">
              {!isLoading && !hasError && (
                <>
                  <Heading
                    text={
                      details?.title?.english ||
                      details?.title?.romaji ||
                      details?.title?.native
                    }
                    loading={isLoading}
                    className="!text-xl shrink-0 !line-clamp-20"
                  />
                  <div className="grow w-full overflow-auto">
                    <span
                      className="text-[#f2f2f2] text-sm md:text-base"
                      ref={synopsisRef}
                    ></span>
                  </div>
                </>
              )}
              {isLoading && !hasError && (
                <>
                  <span className="skeleton-load w-full h-6"></span>
                  <span className="skeleton-load w-[60%] h-6"></span>
                  <span className="skeleton-load w-[80%] h-6 md:hidden"></span>
                  <div className="m-1"></div>
                  <span className="skeleton-load w-[85%] h-6"></span>
                  <span className="skeleton-load w-[60%] md:w-1/2 h-6"></span>
                  <span className="skeleton-load w-[25%] h-6"></span>
                  <div className="m-1"></div>
                  <span className="md:hidden w-full h-6 skeleton-load"></span>
                  <span className="skeleton-load w-[60%] md:w-1/2 h-6"></span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-x-2 w-full h-auto p-2 max-h-[45vh]">
          <div className="w-1/3 grid gap-1.5 mt-2 shrink-0 md:w-1/6 px-2 py-1">
            {!hasError && (
              <>
                {details?.status !== 'NOT_YET_RELEASED' && (
                  <OutlinedButton
                    loadStyle="!w-full !border-none !h-8"
                    callback={() => {
                      navigate(
                        `/anime/watch/${details?.id}/${slugify(
                          details?.title?.romaji || details?.title?.native
                        )}`
                      );
                    }}
                    loading={isLoading}
                    className="!rounded-md"
                  >
                    <span className="flex justify-center gap-1 font-semibold">
                      Watch <PlayCircle className="h-full shrink-0" />
                    </span>
                  </OutlinedButton>
                )}

                <EntryBadge
                  className="!h-8 px-3 !justify-center !rounded-lg !text-sm shrink-0 grow-0 font-semibold"
                  loading={isLoading}
                  entry={`Eps ${details?.episodes || '???'}`}
                  loadStyle="h-8 !rounded-md"
                />
                <ScoreBadge
                  className="!h-8 !rounded-lg !justify-center px-3 !text-sm shrink-0 grow-0"
                  loading={isLoading}
                  score={details?.meanScore}
                  loadStyle="h-8 !rounded-md"
                />
                <FavoriteBadge
                  className="!h-8 !rounded-lg px-3 !text-sm shrink-0 grow-0"
                  loading={isLoading}
                  favorite={details?.favourites}
                  loadStyle="h-8 !rounded-md"
                />

                <FormatBadge
                  format={details?.format}
                  loading={isLoading}
                  className="!rounded-lg px-3 !justify-center !text-sm shrink-0 grow-0 !h-8 font-semibold"
                  loadStyle="h-8 !rounded-md"
                />
                <DurationBadge
                  className="!px-3 !rounded-lg !justify-center !bg-(--blue) !text-sm shrink-0 grow-0 !h-8 font-semibold"
                  entry={details?.duration ? `${details?.duration} mins` : '??'}
                  loading={isLoading}
                  loadStyle="h-8 !rounded-md"
                />
                <EntryBadge
                  className="!rounded-lg !justify-center !bg-(--blue) px-3 !text-sm shrink-0 grow-0 !h-8 font-semibold"
                  loading={isLoading}
                  entry={`${details?.status}`}
                  loadStyle="h-8 !rounded-md"
                />
              </>
            )}

            {hasError && <ErrorOverlay className="!static" />}
          </div>
          <div className="grow-1 shrink flex flex-col gap-1 h-auto p-2">
            {!hasError && (
              <>
                {!isLoading && (
                  <>
                    <div className="grid grid-cols-1 h-full overflow-auto rm-scrollbar">
                      {details.status === 'RELEASING' && (
                        <span className="text-neutral-300 font-semibold text-base">
                          Updated at:{' '}
                          <span className="text-sm font-normal">
                            {formatTimestamp(details?.updatedAt)}
                          </span>
                        </span>
                      )}
                      <span className="text-neutral-300 font-semibold text-base">
                        Aired:{' '}
                        <span className="text-sm font-normal">
                          {formatDate({
                            day: details?.startDate.day,
                            month: details?.startDate.month,
                            year: details?.startDate.year,
                          }) || '?'}
                          {' to '}
                          {formatDate({
                            day: details?.endDate.day,
                            month: details?.endDate.month,
                            year: details?.endDate.year,
                          }) || '?'}
                        </span>
                      </span>
                      <span className="text-neutral-300 text-base font-semibold">
                        Season:{' '}
                        <span className="text-sm font-normal">
                          {details?.season
                            ? `${details?.season} ${formatDate({
                                year: details?.startDate?.year,
                              })}`
                            : '?'}
                        </span>
                      </span>
                      <span className="text-neutral-300 text-base text-wrap font-bold">
                        Studios:{' '}
                        <span className="text-sm font-normal">
                          {formatArrToString(details?.studios?.nodes, 'name')}
                        </span>
                      </span>

                      <span className="text-neutral-300 text-base text-wrap font-bold">
                        Tags:{' '}
                        <span className="text-sm font-normal">
                          {formatArrToString(details?.tags, 'name')}
                        </span>
                      </span>

                      <span className="text-neutral-300 text-base font-bold">
                        Romaji:{' '}
                        <span className="text-sm font-normal">
                          {details?.title?.romaji || '?'}
                        </span>
                      </span>

                      <span className="text-neutral-300 text-base font-bold">
                        Native:{' '}
                        <span className="text-sm font-normal">
                          {details?.title?.native || '?'}
                        </span>
                      </span>
                      <div className="flex h-auto w-full flex-wrap gap-1.5 mt-1">
                        {details?.genres?.map((genre, i) => {
                          return (
                            <GradientBlueBadge
                              key={i}
                              text={genre}
                              loading={false}
                              className="!h-8 !flex !justify-center !items-center !text-base !p-2"
                            />
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {isLoading && (
                  <div className="size-full grid gap-y-2">
                    <span className="skeleton-load h-5 !rounded-xl w-2/3"></span>
                    <span className="skeleton-load h-5 !rounded-xl w-1/2"></span>
                    <span className="skeleton-load h-5 !rounded-xl w-5/12"></span>
                    <span className="skeleton-load h-5 !rounded-xl w-3/6"></span>
                    <span className="skeleton-load h-5 !rounded-xl w-9/10"></span>
                    <span className="skeleton-load h-5 !rounded-xl w-1/7"></span>
                    <div className="h-8 w-full grid gap-2 grid-cols-10">
                      {Array.from({ length: 6 }, (_, i) => {
                        return (
                          <EntryBadge key={i} loadStyle="!rounded-md h-8" />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {hasError && <ErrorOverlay className="!static" />}
          </div>
        </div>
      </section>
    </main>
  );
}

export default AnimeDetail;
