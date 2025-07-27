import { useCallback } from 'react';

function useGetAnimeSrc(
  { classes = [], query = '', ep = null },
  cb = () => {}
) {
  let isMounted = true;

  return useCallback(async () => {
    if (!classes.length || !query) return;

    const res = {
      state: '...Searching',
      completed: false,
      sources: [],
    };

    cb(res);

    try {
      const searchRes = await Promise.all(
        classes.map(async (c) => {
          const { data, error, message } = await c.search(query);
          if (error) {
            console.error('Error', message);
            return null;
          } //dont throw an error else whole script will stop
          return data;
        })
      );

      if (!isMounted) return;

      if (searchRes[0].length <= 0) {
        cb({ data: [], completed: true });
        return;
      }

      if (!isMounted) return;

      cb({
        ...res,
        state: '...Fetching episodes',
        data: searchRes,
      });

      const eps = await Promise.all(
        searchRes.filter(Boolean).map(async (s, i) => {
          const url = s[0].url;
          console.log(url);
          const response = await classes[i].getEps({
            url,
            ep,
          });
          const { data, error, message } = response;
          if (error) {
            console.error('Error', message);
            console.log(response);
            return null;
          }

          return data;
        })
      );

      if (!isMounted) return;

      cb({
        ...res,
        state: '...Fetching episode source',
        data: eps,
      });

      const epSrc = await Promise.all(
        eps.filter(Boolean).map(async (e, i) => {
          const url = e[0].url;
          const { data, error, message } = await classes[i].getEpSrc(url);
          if (error) {
            console.error('Error', message);
            return null;
          }
          res['sources'] = [
            ...res.sources,
            { from: classes[i].srcFrom, url: url },
          ];
          return data;
        })
      );

      if (!isMounted) return;
      cb({
        ...res,
        state: 'Fetching complete',
        data: epSrc,
        completed: true,
      });
    } catch (err) {
      cb({
        error: true,
        state: 'Fetching failed. Try again later',
        message: err.message || err,
      });
    }

    return () => {
      isMounted = false;
      console.log('unmounted');
    };
  });
}

export default useGetAnimeSrc;
