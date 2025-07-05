import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Searchbar from './inputs/Searchbar';
import KebabMenuButton from './buttons/KebabMenuButton';

function Navbar() {
  const [navigations, setNavigations] = useState([]);

  const navMenuRef = useRef(null);
  const navMenuButtonRef = useRef(null);

  useEffect(() => {
    fetch('/navigations.json')
      .then((res) => res.json())
      .then((res) => setNavigations(res.main));

    const navMenu = navMenuRef.current;
    const navMenuButton = navMenuButtonRef.current;

    const handleClickOutsideTarget = (e) => {
      if (!navMenu.contains(e.target) && !navMenuButton.contains(e.target)) {
        navMenu.classList.add('hide-left');
        navMenu.classList.remove('appear-left');
      }
    };

    const navMenuTggle = () => {
      navMenu.classList.toggle('hide-left');
      navMenu.classList.toggle('appear-left');
    };

    document.addEventListener('click', handleClickOutsideTarget);

    navMenuButton.addEventListener('click', navMenuTggle);

    return () => {
      navMenuButton.removeEventListener('click', navMenuTggle);
      document.removeEventListener('click', handleClickOutsideTarget);
    };
  }, []);

  return (
    <nav className="h-10 w-full bg-(--charc) flex items-center sticky top-0 shadow-2xl z-3">
      <div
        ref={navMenuButtonRef}
        role="hamburger bar"
        className="flex flex-col gap-2 relative justify-center items-center h-8 w-8 ms-2 cursor-pointer md:hidden"
      >
        <Menu color="white" className="h-full w-full" />
      </div>

      <div className="w-auto ms-3 h-8 md:ms-5" role="branch logo wrapper">
        <Link
          to="#"
          className="block w-full h-full text-2xl font-semibold text-(--blue)"
        >
          IDK
        </Link>
      </div>

      <ul
        ref={navMenuRef}
        className="list-none absolute w-[150px] top-10 gap-[1px] hide-left flex flex-col bg-(--charc) h-dvh transition-right duration-200 ease-in-out md:h-auto md:relative md:top-0 md:!left-0 md:flex-row md:ms-5 md:w-auto md:!opacity-100 md:!z-3"
        role="navbar menu"
      >
        {navigations.map((nav, idx) => {
          return (
            <li
              key={idx}
              className="w-full overflow-hidden ps-2 rounded-md hover:bg-neutral-600 md:w-20 md:ps-0"
            >
              <NavLink
                to={nav.path}
                className={({ isActive }) =>
                  `${
                    isActive ? 'text-(--blue)' : 'text-white'
                  } block w-full font-medium md:text-center`
                }
              >
                {nav.label}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <Searchbar className="absolute right-10 !w-50 md:!w-60" />
      <KebabMenuButton className="absolute right-1" />
    </nav>
  );
}

export default Navbar;
