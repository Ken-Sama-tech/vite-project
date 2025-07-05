import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function ShowDetailButton({ className = '', goto = '#', loading = true }) {
  return (
    <Link to={goto}>
      <button
        className={`${
          loading
            ? 'skeleton-load py-4 px-15'
            : 'bg-(--blue) cursor-pointer py-1 px-2'
        } ${className} text-white rounded-sm`}
      >
        {!loading && (
          <span className="flex items-center text-sm">
            Show Detail <ChevronRight size={24} />
          </span>
        )}
      </button>
    </Link>
  );
}

export default ShowDetailButton;
