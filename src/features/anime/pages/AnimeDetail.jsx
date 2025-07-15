import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import anilist from '../../../lib/api/anilist';
import { formatDate } from '../../../lib/utils/utils';
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
import OutlinedButton from '../../../components/buttons/OutlinedButton';
import { PlayCircle } from 'lucide-react';

function AnimeDetail() {
  const params = useParams();

  const [details, setDetails] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const synopsisRef = useCallback(
    (node) => {
      if (!node) return;
      node.innerHTML = details?.description;
    },
    [details]
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
          {
            title: ['english', 'romaji', 'native'],
            coverImage: ['extraLarge'],
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

        <div className="w-full h-auto flex">
          <div
            role="filler"
            className="shrink-0 h-73 w-52 sm:h-80 sm:w-57 md:w-60 md:h-43"
          ></div>
          <div className="max-h-73 grow-1 flex flex-col gap-y-2 justify-start items-start md:items-start">
            <div className="w-full h-auto max-h-full overflow-y-auto gap-2 flex flex-col p-2 rm-scrollbar scroll-smooth">
              {!isLoading && (
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
                  <span
                    className="text-wrap text-[#f2f2f2]"
                    ref={synopsisRef}
                  ></span>
                </>
              )}
              {isLoading && (
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
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col border border-red-800 w-full h-80 p-2">
          <div className="w-full grid grid-cols-3 gap-1 md:w-1/2">
            <EntryBadge
              className="!h-8 px-3 !justify-center !rounded-lg !text-sm shrink-0 grow-0 font-semibold"
              loading={isLoading}
              entry={`Eps ${details?.episodes || '???'}`}
            />
            <ScoreBadge
              className="!h-8 !rounded-lg !justify-center px-3 !text-sm shrink-0 grow-0"
              loading={isLoading}
              score={details?.meanScore}
            />
            <FavoriteBadge
              className="!h-8 !rounded-lg px-3 !text-sm shrink-0 grow-0"
              loading={isLoading}
              favorite={details?.favourites}
            />

            <FormatBadge
              format={details?.format}
              loading={isLoading}
              className="!rounded-lg px-3 !justify-center !text-sm shrink-0 grow-0 !h-8 font-semibold"
            />
            <DurationBadge
              className="!px-3 !rounded-lg !justify-center !bg-(--blue) !text-sm shrink-0 grow-0 !h-8 font-semibold"
              entry={`${details?.duration} min per ep`}
              loading={isLoading}
            />
            <EntryBadge
              className="!rounded-lg !justify-center !bg-(--blue) px-3 !text-sm shrink-0 grow-0 !h-8 font-semibold"
              loading={isLoading}
              entry={`${details?.status}`}
            />
          </div>

          <div className="w-full flex gap-1 h-auto mt-5">
            {!isLoading &&
              details?.genres?.map((genre, i) => {
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
      </section>
    </main>
  );
}

export default AnimeDetail;
/*          <EntryBadge
              className="!h-6 !px-3 !rounded-lg !justify-center !bg-(--blue) !text-sm shrink-0 grow-0 md:!h-8 font-semibold"
              entry={`${details?.duration} min per ep`}
              loading={isLoading}
            />
            <EntryBadge
              className="!h-6 !rounded-lg !justify-center !bg-(--blue) px-3 !text-sm shrink-0 grow-0 md:!h-8 font-semibold"
              loading={isLoading}
              entry={`${details?.status}`}
            />
            <FormatBadge
              format={details?.format}
              loading={isLoading}
              className="!h-6 !rounded-lg px-3 !justify-center !text-sm shrink-0 grow-0 md:!h-8 font-semibold"
            />*/
/*{!hasError && (
          <div className="!size-auto grid-rows-4 gap-1 grid grid-cols-3 absolute z-3 top-full mt-2s left-50 sm:left-55 sm:w-1/2 md:bottom-0 md:left-60 md:mt-0 md:top-auto border border-red-200">
            <div className="flex flex-wrap relative justify-center col-span-3 ">
              <Heading
                text={
                  details?.title?.english ||
                  details?.title?.romaji ||
                  details?.title?.native
                }
                loading={isLoading}
                className="text-shadow-2xs line-clamp-5"
              />
            </div>
            <ScoreBadge
              className="!h-8 !rounded-lg !bg-(--blue) !justify-center px-3 !text-sm shrink-0 grow-0"
              loading={isLoading}
              score={details?.meanScore}
            />
            <FavoriteBadge
              className="!h-8 !rounded-lg !bg-(--blue) px-3 !text-sm shrink-0 grow-0"
              loading={isLoading}
              favorite={details?.favourites}
            />
            <EntryBadge
              className="!h-8 px-3 !bg-(--blue) !justify-center !rounded-lg !text-sm shrink-0 grow-0 font-semibold"
              loading={isLoading}
              entry={`Eps ${details?.episodes || '???'}`}
            />

            <div className="col-span-3 items-center flex gap-1">
              <OutlinedButton
                className="flex gap-1 font-semibold !rounded-md w-1/2"
                loading={isLoading}
              >
                <PlayCircle className="" />
                <span>Watch Trailer</span>
              </OutlinedButton>

              <BookmarkButton
                className="!flex !justify-center w-1/2"
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
          </div>
        )}*/
