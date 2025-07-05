import SubHeading from '../texts/SubHeading';
import FormatBadge from '../badges/FormatBadge';
import EntryBadge from '../badges/EntryBadge';
import ScoreBadge from '../badges/ScoreBadge';
import FavoriteBadge from '../badges/FavoriteBadge';

function MediaCardTooltip({ className = '', params = {} }) {
  const {
    title = '',
    score = null,
    entry = '???',
    alt = [],
    favorites = null,
    format = '???',
    status = '',
    aired = '???',
    genres = [],
  } = params;

  return (
    <div
      className={`h-full w-full bg-[rgba(0,0,0,0.1)] backdrop-blur-2xl absolute top-0 rounded-2xl overflow-x-hidden z-3 overflow-y-auto rm-scrollbar flex flex-col justify-start gap-1 p-2 ${className}`}
    >
      <SubHeading loading={false} text={title} className="!font-bold" />
      <div className="flex w-full h-auto justify-start items-center gap-1">
        <FormatBadge
          loading={false}
          format={format}
          className="h-6 w-auto text-nowrap"
        />
        <EntryBadge
          loading={false}
          entry={entry}
          className="h-6 w-auto text-nowrap"
        />
        <ScoreBadge
          loading={false}
          score={score}
          className="h-6 w-auto text-nowrap"
        />
        <FavoriteBadge
          loading={false}
          favorite={favorites}
          className="h-6 w-auto text-nowrap"
        />
      </div>

      <div
        role="gray divider"
        className="bg-neutral-400 h-[2px] w-full my-1"
      ></div>

      <div className="flex flex-col w-auto h-auto">
        <span className="text-base text-white">Romaji: {alt[0]}</span>
        <span className="text-base text-white">Native: {alt[1]}</span>
        <span className="text-white text-base">Aired: {aired}</span>
        <span className="text-white text-base">Status: {status}</span>
      </div>
      <div
        role="gray divider"
        className="bg-neutral-400 h-[2px] w-full my-1"
      ></div>

      <span className="text-white text-base">
        Genres:{' '}
        {genres.map((genre, idx) => {
          return idx == genres.length - 1 ? genre : `${genre}, `;
        })}
      </span>
    </div>
  );
}

export default MediaCardTooltip;
