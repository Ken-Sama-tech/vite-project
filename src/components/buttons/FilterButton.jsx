import { ListFilter } from 'lucide-react';
import OutlinedButton from './OutlinedButton';
import { useEffect, useRef, useState } from 'react';
import ErrorOverlay from '../overlay/ErrorOverlay';

function FilterButton({
  className = '',
  options = [],
  callback = () => {},
  selectedOptions = [],
  loading = true,
}) {
  const optionMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const optionMenu = optionMenuRef?.current;
    const menuButton = menuButtonRef?.current;

    const handleToggle = () => {
      const isHidden = optionMenu.classList.contains('hidden');
      optionMenu.classList.toggle('grid', isHidden);
      optionMenu.classList.toggle('hidden', !isHidden);
    };

    const handleClickOutside = (e) => {
      if (!menuButton.contains(e.target) && !optionMenu.contains(e.target)) {
        optionMenu.classList.remove('grid');
        optionMenu.classList.add('hidden');
      }
    };

    menuButton.addEventListener('click', handleToggle);
    document.addEventListener('click', handleClickOutside);

    return () => {
      menuButton.removeEventListener('click', handleToggle);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {loading && <button className="py-3 px-8 skeleton-load"></button>}
      {!loading && (
        <div className="h-auto w-auto relative">
          <button
            ref={menuButtonRef}
            className={`size-8 cursor-pointer ${className}`}
          >
            <ListFilter strokeWidth={2} className="size-full text-white" />
          </button>

          <ul
            ref={optionMenuRef}
            className="list-none z-99 w-[350px] h-auto max-h-[60vh] rm-scrollbar overflow-y-auto absolute top-full right-0 shadow-2xl rounded-md bg-(--charc) hidden grid-cols-3 gap-x-1 p-2"
          >
            {options.length > 0 && (
              <>
                {options.map((option, idx) => {
                  const isSelected = selectedOptions.includes(option);
                  return (
                    <li key={idx} className="h-10">
                      <OutlinedButton
                        className={`!w-full line-clamp-1 ${
                          isSelected ? 'bg-(--blue)' : ''
                        }`}
                        loading={false}
                        name={option}
                        callback={(e) => {
                          const toggleState =
                            !e.target.classList.contains('bg-(--blue)');
                          e.target.classList.toggle('bg-(--blue)', toggleState);
                          if (toggleState) {
                            callback({ [option]: true });
                          } else {
                            callback({ [option]: false });
                          }
                        }}
                      />
                      ;
                    </li>
                  );
                })}
              </>
            )}

            {options.length <= 0 && (
              <ErrorOverlay
                className="static w-full"
                message="No filter options found"
              />
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default FilterButton;
