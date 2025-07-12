import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ScoreBadge from '../badges/ScoreBadge';
import SubHeading from '../texts/SubHeading';
import EntryBadge from '../badges/EntryBadge';
import CardErrorOverlay from '../overlay/CardErrorOverlay';
import debounce from '../../lib/utils/debounce';
import { Play } from 'lucide-react';
import MediaCardTooltip from '../tooltips/MediaCardTooltip';

function MediaCard({
  className = '',
  loading = true,
  hasError = false,
  params = {},
  tooltip = true,
  callback = () => {},
}) {
  const {
    image = '',
    title = '',
    score = null,
    entry = null,

    //everything below is only used for the mediacard tooltip or whatever they call that, but chatgpt call it tooltip so it is a tooltip.
    // alt = [],
    // favorites = null,
    // format = '',
    // status = '',
    // aired = '',
    // genres = [],
  } = params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(image);
  const [error, setError] = useState(false);
  const [screenSize, setScreenSize] = useState(0);
  const [isInHover, setIsInHover] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState('');

  const cardRef = useRef(null);
  const getDetailsRef = useRef(null);

  useEffect(() => {
    let timeout;

    if (!image) {
      setIsLoading(true);
      timeout = setTimeout(() => {
        setError(true);
        setIsLoading(false);
      }, 30000);
    } else {
      setScreenSize(window.innerWidth);
      clearTimeout(timeout);
      setImageUrl(image);
      setShowTooltip(tooltip);
      !loading && setIsLoading(false);
    }

    if (hasError) {
      setError(true);
      !loading && setIsLoading(false);
      return;
    }

    const updateScreenSize = debounce(() => {
      const ss = window.innerWidth;
      setScreenSize(ss);
    }, 1000);

    window.addEventListener('resize', updateScreenSize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateScreenSize);
    };
  }, [image, loading]);

  useEffect(() => {
    if (isLoading) return;

    const card = cardRef?.current;
    const getDetail = getDetailsRef?.current;
    const allowedSs = 980;
    if (screenSize < allowedSs && tooltip) {
      setShowTooltip(false);
    } else if (screenSize >= allowedSs && tooltip) {
      setShowTooltip(true);
    }

    if (!card) return;

    const inHover = () => {
      setIsInHover(true);
    };

    const notInHover = () => {
      setIsInHover(false);
    };

    card?.addEventListener('mouseenter', inHover);
    card?.addEventListener('mouseleave', notInHover);
    getDetail?.addEventListener('click', callback);

    return () => {
      card?.removeEventListener('click', callback);
      card?.removeEventListener('mouseenter', inHover);
      getDetail?.removeEventListener('mouseleave', notInHover);
    };
  }, [screenSize, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!showTooltip) return;

    const card = cardRef?.current;

    if (!card) return;

    const { left, right } = card?.getBoundingClientRect();

    if (left >= screenSize - right) {
      setTooltipPosition('right-full');
    } else {
      setTooltipPosition('left-full');
    }
  }, [isInHover, isLoading]);

  return (
    <>
      {isLoading && <div className="skeleton-load h-full aspect-[2/3]"></div>}

      {!isLoading && !error && (
        <div
          ref={cardRef}
          className={`group cursor-pointer h-full aspect-[2/3] rounded-md relative snap-center shrink-0 ${className}`}
        >
          <div
            ref={getDetailsRef}
            className={`h-full w-full relative overflow-hidden rounded-md ${
              isInHover && 'blur-effect'
            }`}
          >
            <img
              loading="lazy"
              src={
                imageUrl ||
                'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg'
              }
              alt="Media"
              className="w-full h-full object-cover rounded-md z-1"
            />

            <div className="bg-[rgba(0,0,0,0.3)] top-0 left-0 absolute h-full w-full z-2 inset-0">
              {score && (
                <ScoreBadge
                  className="absolute top-[2px] right-[2px] !h-6"
                  score={score}
                  loading={false}
                />
              )}
              {entry && (
                <EntryBadge
                  loading={false}
                  className="absolute left-[2px] top-[2px] !h-6"
                  entry={entry}
                />
              )}

              <SubHeading
                text={title}
                loading={false}
                className="absolute bottom-0 left-0 text-center w-full !text-base"
              />
            </div>
          </div>

          {isInHover && (
            <>
              <Play className="absolute group fade-in h-10 w-10 z-3 text-(--blue) top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              {showTooltip && (
                <MediaCardTooltip
                  className={`!h-auto !w-auto max-h-[100%] mx-2 overflow-y-auto ${tooltipPosition}`}
                  params={params}
                />
              )}
            </>
          )}
        </div>
      )}

      {error && !isLoading && <CardErrorOverlay />}
    </>
  );
}

export default MediaCard;
