import { useEffect, useState } from 'react';
import { slugify } from '../../../lib/utils/utils';

function EpisodeList({ className = '', titles = {} }) {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const titleList = Object.values(titles);

    const fetchEpisodes = (async () => {
      for (let i = 0; i < titleList.length - 1; i++) {
        const { data, error } = await animeApi.search(titleList[i]);

        if (error || !data.length) continue;

        if (data) {
          setResult(data);
          break;
        }
      }
    })();
  }, [titles]);

  console.log(result);

  return (
    <section className={`h-[50vh] w-full ${className}`}>EpisodeList</section>
  );
}

export default EpisodeList;
