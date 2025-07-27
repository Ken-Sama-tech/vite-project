import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { cache } from '../../../lib/api/cache';
import animeSuge from '../../../lib/api/animeSuge';
import { useNavigate } from 'react-router-dom';
import anilist from '../../../lib/api/anilist';
import useGetAnimeSrc from '../../../lib/hooks/useGetAnimeSrc';
import SubHeading from '../../../components/texts/SubHeading';
import { slugify } from '../../../lib/utils/utils';
import debounce from '../../../lib/utils/debounce';
import EpisodeListSidebar from '../components/EpisodeListSidebar';
import LoadingSpinner from '../../../components/LoadingSpinner';

function WatchAnime() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const idMal = params.id;
  const episode = searchParams.get('ep');
  const title = params.slug;
  const location = useLocation();

  const [error, setError] = useState(false);
  const [animeUrl, setAnimeUrl] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);

  const loadingRef = useRef(null);
  const loadingTextRef = useRef(null);

  useEffect(() => {
    if (!title) {
      const titles = ['romaji', 'english', 'native'];
      anilist.getAnime(
        {
          data: ['id', { title: [...titles] }],
          mediaParams: { id: idMal },
          limit: 1,
          page: 1,
        },
        (res) => {
          const { data, error } = res;

          if (error) {
            setError(true);
            console.log('Error', res);
            return;
          }

          const base = data?.Page.media[0];
          const id = base?.id;

          for (let i in titles) {
            const title = base.title[titles[i]];
            if (title) {
              window.location.href = `/anime/watch/${id}/${slugify(title, {
                character: '-',
              })}`;
              break;
            }

            continue;
          }
        }
      );
    }

    document.title = `WATCH ${slugify(title, {
      character: ' ',
      casing: 'upper',
    })} EP ${episode}`;

    (async () => {
      if (episode) return;
      const res = await cache.search(idMal);
      const { data = {}, error } = res;

      if (error) {
        console.error('Error', res);
        return;
      }

      if (!Object.keys(data).length) {
        navigate(`?ep=${1}`);
        return;
      }

      const lastEp = data.lastEpisodeWatched || 1;

      navigate(`?ep=${lastEp}`);
    })();
  }, []);

  const getAnime = useCallback(
    debounce(async (node) => {
      if (!node) return;
      node?.removeAttribute('src');
      const loadingText = loadingTextRef.current;
      const loading = loadingRef.current;
      loading?.removeAttribute('hidden');

      try {
        if (!animeUrl) {
          loadingText.textContent = 'Searching';

          const search = (await animeSuge.search(title))?.data[0];

          if (!search) {
            loadingText.textContent = 'No result found';
            loading.setAttribute('hidden', '');
            return;
          }

          const url = search.url;

          if (search.eps < Number(episode)) {
            navigate('?ep=1');
            loadingText.textContent = 'Invalid episode. Redirecting user';
          }
          setAnimeUrl(url);
          loadingText.textContent = 'Fetching episodes';

          const { error, errType, data, message, eps } = await animeSuge.getEps(
            {
              url,
              ep: episode,
            }
          );

          if (error) {
            if (errType === 'special') {
              getAnime(node);
              console.error(message);
              loadingText.textContent =
                'Error occur while fetching episodes. Trying to refetch';
            }
            console.error(message);
            throw new Error(message);
          }

          loadingText.textContent = 'Fetching embedded video';
          setEpisodeList(eps);

          const epSrcUrl = data[0].url;
          const src = (await animeSuge.getEpSrc(epSrcUrl)).data.src;

          if (src) {
            node.src = src;
            loading.setAttribute('hidden', '');
          }
        } else {
          loadingText.textContent = 'Fetching embedded video';
          const index = animeUrl?.indexOf('ep-') + 3;
          const epSrcUrl = animeUrl?.slice(0, index) + String(episode);
          const { data, error, message } = await animeSuge.getEpSrc(epSrcUrl);

          if (error) {
            console.error(message);
            loadingText.textContent = 'Error occur while fetching episode';
            return;
          }

          if (!data) {
            loadingText.textContent =
              'Failed to fetch embedded video. Try again later';
            return;
          }
          const { src } = data;

          if (src) {
            node.src = src;
            loading.setAttribute('hidden', '');
          }
        }
      } catch (error) {
        console.error('Error', error.message || error);
      }

      return () => {
        loadingRef?.current.removeAttribute('hidden');
        node.src = null;
      };
    }),
    [episode]
  );

  return (
    <main className="h-auto flex flex-wrap">
      <section className="h-[60vh] w-full bg-(--charc) md:w-6/9 lg:w-7/9 md:h-[90vh]">
        <div className="size-full flex relative">
          <div
            className="flex flex-col gap-2 justify-center items-center size-full w-full absolute"
            ref={loadingRef}
          >
            <LoadingSpinner />
            <div className="text-(--blue) flex text-md">
              <span className="font-bold text-blue text-xl">...</span>
              <p className="text-md font-bold pt-1" ref={loadingTextRef}>
                Loading
              </p>
            </div>
          </div>
          <iframe
            src={null}
            frameBorder="0"
            allowFullScreen
            ref={getAnime}
            className="size-full"
          ></iframe>
        </div>
      </section>
      <EpisodeListSidebar episodes={episodeList} episode={episode} />
    </main>
  );
}

export default WatchAnime;
