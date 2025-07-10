import SecondaryLayout from '../../../layouts/SecondaryLayout';
import { Outlet, useSearchParams } from 'react-router-dom';

function AnimePage() {
  const [searchParams] = useSearchParams();
  const genre = searchParams.get('genre');

  return (
    <SecondaryLayout
      className="!h-dvh overflow-y-auto rm-scrollbar"
      heading={genre ? 'Browse by Genre' : 'Anime'}
    >
      <Outlet />
    </SecondaryLayout>
  );
}

export default AnimePage;
