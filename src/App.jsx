import { Route, Routes } from 'react-router-dom';
import Anime from './pages/Anime';
import Manga from './pages/Manga';
import Novel from './pages/Novel';
import History from './pages/History';
import Library from './pages/Library';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch('/navigations.json')
      .then((res) => res.json())
      .then((res) => {
        setMainNavigations(res.main);
        setIsLoading(false);
      });
  }, []);

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
        </Routes>
      )}
    </>
  );
}

export default App;
