import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import anilist from '../../../lib/api/anilist';
import CoverBanner from '../../../components/banners/CoverBanner';
import ImageCard from '../../../components/cards/ImageCard';

function AnimeDetail() {
  const params = useParams();

  const [details, setDetails] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const idMal = params.id;
    anilist.getAnime(
      {
        data: [
          'id',
          { title: ['english', 'romaji', 'native'] },
          { coverImage: ['extraLarge'] },
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
        console.log(data);
      }
    );
  }, []);

  return (
    <div>
      <CoverBanner className="!h-[50vh]" url={details?.bannerImage}>
        <ImageCard
          className="absolute top-1/2 -translate-y-[35%] left-5 !h-[300px]"
          url={details?.coverImage?.extraLarge}
          loading={isLoading}
        />
      </CoverBanner>
    </div>
  );
}

export default AnimeDetail;
