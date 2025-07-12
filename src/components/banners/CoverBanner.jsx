import CardErrorOverlay from '../overlay/CardErrorOverlay';

function CoverBanner({ url = '', children, className = '' }) {
  return (
    <div
      role="banner"
      style={{ backgroundImage: `url(${url})` }}
      className={`  aspect-[2/1] md:aspect-[7/5] w-full ${className}`}
    >
      {/* {!url && (
        <CardErrorOverlay
          className="!aspect-[2/1] md:!aspect-[7/5]! w-full"
          message="No image found"
        />
      )} */}
      {children}
    </div>
  );
}

export default CoverBanner;
