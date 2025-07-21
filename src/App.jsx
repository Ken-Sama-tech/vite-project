import { Route, Routes } from 'react-router-dom';
import Anime from './pages/Anime';
import Manga from './pages/Manga';
import Novel from './pages/Novel';
import History from './pages/History';
import Library from './pages/Library';
import AnimePage from './features/anime/pages/AnimePage';
import BrowseByGenre from './features/anime/pages/BrowseByGenre';
import AnimeList from './features/anime/components/AnimeList';
import AnimeDetail from './features/anime/pages/AnimeDetail';
import { useLocation } from 'react-router-dom';
import WatchAnime from './features/anime/pages/WatchAnime';
import { useEffect, useState } from 'react';
import PageNotFound from './pages/PageNotFound';
import NetworkError from './pages/NetworkError';

const mainPage = new Map([
  ['Anime', <Anime />],
  ['Manga', <Manga />],
  ['Novel', <Novel />],
  ['Library', <Library />],
  ['History', <History />],
]);

function App() {
  const [mainNavigations, setMainNavigations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch('/navigations.json')
      .then((res) => res.json())
      .then((res) => {
        setMainNavigations(res.main);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const dir = location.pathname.toLowerCase();

    const paths = ['Manga', 'Novel', 'History', 'Library'];

    if (dir.includes('anime') || dir === '/') {
      document.title = 'Anime';
      return;
    } else {
      paths.map((path) => {
        if (dir.includes(path.toLowerCase())) {
          document.title = path;
        }
      });
    }
  }, [location.pathname]);

  return (
    <>
      {!isLoading && (
        <Routes>
          {mainNavigations.map((nav, idx) => {
            return (
              <Route
                key={idx}
                path={nav.path}
                element={mainPage.get(nav.label)}
              />
            );
          })}
          <Route path="*" element={<PageNotFound />} />
          <Route path="/error/network" element={<NetworkError />} />
          <Route path="/anime" element={<AnimePage />}>
            <Route index element={<AnimeList />} />
            <Route path="genres" element={<BrowseByGenre />} />
            <Route path=":id/:slug?" element={<AnimeDetail />} />
            <Route path="watch/:id/:slug?" element={<WatchAnime />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
