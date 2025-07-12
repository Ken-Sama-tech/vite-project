import { useState } from 'react';
import SecondaryLayout from '../../../layouts/SecondaryLayout';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function AnimePage() {
  const params = useParams();
  const location = useLocation();
  const dir = location.pathname;

  const [heading] = useState(() => {
    if (dir.includes('genres')) return 'Browse by Genre';
    else if (params.id) return null;
    else return 'Browse Anime';
  }, [location.pathname]);

  return (
    <SecondaryLayout
      className="!h-dvh overflow-y-auto rm-scrollbar"
      heading={heading}
      goto={-1}
    >
      <Outlet />
    </SecondaryLayout>
  );
}

export default AnimePage;
