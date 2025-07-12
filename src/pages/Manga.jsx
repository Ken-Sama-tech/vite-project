import MainLayout from '../layouts/MainLayout';
import AnimeList from '../features/anime/components/AnimeList';

function Manga() {
  return (
    <MainLayout>
      <div className="h-dvh">
        <AnimeList />
      </div>
    </MainLayout>
  );
}

export default Manga;
