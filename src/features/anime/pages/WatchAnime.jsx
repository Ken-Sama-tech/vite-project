import { useEffect, useCallback, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { cache } from '../../../lib/api/cache';
import animeSuge from '../../../lib/api/animeSuge';
import { useNavigate } from 'react-router-dom';
import useGetAnimeEpSrc from '../../../lib/hooks/useGetAnimeEpSrc';

function WatchAnime() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const idMal = params.id;
  const episode = searchParams.get('ep');
  const title = params.slug;

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (episode) return;
      const res = await cache.search(idMal);
      const { data = {}, error } = res;

      if (error) {
        console.error('Error', res);
        return;
      }

      if (!Object.keys(data).length) return 1;

      const lastEp = data.lastEpisodeWatched || 1;
      const isFinished = data.finishedLastEpisode;

      const ep = isFinished ? lastEp + 1 : lastEp;
      navigate(`?ep=${ep}`);
    })();
  }, []);

  // const iframeRef = useCallback(
  //   (node) => {
  //     if (!node) return;
  //     animeSuge.search(title, (res) => {
  //       const { data, error } = res;
  //       node.innerHTML = '...Searching ';
  //       if (error) {
  //         console.error('Error', res);
  //         return;
  //       }

  //       const url = data[0].url;
  //     });
  //   },
  //   [episode]
  // );

  // console.log('idk');

  useGetAnimeEpSrc(
    { classes: [animeSuge, animeSuge, animeSuge], query: title, ep: episode },
    (res) => {
      console.log(res);
    }
  );

  return <main className="" /*ref={iframeRef}*/></main>;
}

export default WatchAnime;
