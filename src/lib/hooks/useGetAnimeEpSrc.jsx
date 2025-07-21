import { useCallback } from 'react';

function useGetAnimeEpSrc(
  { classes = [], deps = [], query = '', ep = null },
  cb = () => {}
) {
  const start = useCallback(async () => {
    if (!classes.length || !query) return;

    cb({ state: 'Searching...', completed: false });

    try {
      const searchRes = await Promise.all(
        classes.map(async (c) => {
          const { data, error, message } = await c.search(query);
          if (error) return null; //dont throw an error else whole script will stop
          return data;
        })
      );

      if (!searchRes.length) throw new Error('No result found');

      cb({
        state: '...fetching episodes',
        completed: false,
        data: searchRes,
      });

      const eps = await Promise.all(
        searchRes.filter(Boolean).map(async (s, i) => {
          const url = s[0].url;
          const { data, error, message } = await classes[i].getEps({
            url,
            ep,
          });
          if (error) return null;
          return data;
        })
      );

      cb({
        state: '...fetching episode src',
        data: eps,
        completed: false,
      });

      const epSrc = await Promise.all(
        eps.filter(Boolean).map(async (e, i) => {
          const url = e[0].url;
          const { data, error, message } = await classes[i].getEpSrc(url);
          if (error) return null;
          return data;
        })
      );

      cb({ state: 'fetch complete', data: epSrc, completed: true });
    } catch (err) {
      cb({
        error: true,
        state: 'Fetching failed',
        message: err.message || err,
      });
    }
  }, deps);

  return start();
}

export default useGetAnimeEpSrc;
