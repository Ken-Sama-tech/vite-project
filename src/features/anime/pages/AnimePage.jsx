import SecondaryLayout from '../../../layouts/SecondaryLayout';
import { Outlet, useSearchParams } from 'react-router-dom';

function AnimePage() {
  const [searchParams] = useSearchParams();
  const genre = searchParams.get('genre');

  return (
    <SecondaryLayout heading={genre ? 'Browse by Genre' : 'Anime'}>
      <Outlet />
    </SecondaryLayout>
  );
}

export default AnimePage;
