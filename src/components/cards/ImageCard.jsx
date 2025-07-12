import CardErrorOverlay from '../overlay/CardErrorOverlay';

function ImageCard({
  url = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/default.jpg',
  loading = true,
  className = '',
  error = false,
}) {
  return (
    <>
      {!error && (
        <>
          {!loading && (
            <img src={url} className={`aspect-[2/3] h-[350px] ${className}`} />
          )}

          {loading && (
            <div
              className={`aspect-[2/3] h-[350px] skeleton-load ${className}`}
            ></div>
          )}
        </>
      )}

      {error && (
        <div className={`aspect-[2/3] h-[350px] ${className}`}>
          <CardErrorOverlay message="image failed to load" />
        </div>
      )}
    </>
  );
}

export default ImageCard;
