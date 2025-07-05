import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

function Searchbar({ className = '' }) {
  const searchbarRef = useRef(null);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    const searchbar = searchbarRef.current;
    const resultsContainer = searchResultsRef.current;

    const handleClickOutsideTarget = (e) => {
      if (
        !resultsContainer.contains(e.target) &&
        !searchbar.contains(e.target)
      ) {
        resultsContainer.classList.add('hidden');
      }
    };

    const toggleSearchbar = () => {
      resultsContainer.classList.remove('hidden');
      resultsContainer.classList.add('flex');
    };

    searchbar.addEventListener('focus', toggleSearchbar);
    document.addEventListener('click', handleClickOutsideTarget);
    return () => {
      searchbar.removeEventListener('focus', toggleSearchbar);
      document.removeEventListener('click', handleClickOutsideTarget);
    };
  }, []);

  return (
    <div
      className={`border border-neutral-500 rounded-md h-8 w-60 flex items-center gap-[1px] ${className}`}
    >
      <Search color="#2563eb" className="w-10 h-full bg-(--charc) rounded-md" />
      <input
        ref={searchbarRef}
        type="search"
        name=""
        className="w-full h-full focus:outline-none focus:border-none text-white rounded-md"
        placeholder="Search..."
      />

      <div
        ref={searchResultsRef}
        role="search results"
        className="absolute z-3 w-[100vw] h-[50vh] right-0 bg-(--charc) top-[100%] rounded-lg shadow-2xl flex-col items-center p-2 hidden md:w-[350px]"
      >
        <h3 className="text-[1.3rem] text-white">Results</h3>
      </div>
    </div>
  );
}

export default Searchbar;
