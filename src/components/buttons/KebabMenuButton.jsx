import { EllipsisVertical } from 'lucide-react';
import { useEffect, useRef } from 'react';
import SettingsEnum from '../inputs/SettingsEnum';

function KebabMenuButton({ className = '', AddToMenu = {} }) {
  const optionListRef = useRef(null);
  const optionButtonRef = useRef(null);

  useEffect(() => {
    const optionButton = optionButtonRef?.current;
    const optionList = optionListRef?.current;

    const handleToggle = () => {
      optionList?.classList.toggle('hidden');
      optionList?.classList.toggle('flex');
    };

    const handleClickOutsideTarget = (e) => {
      if (!optionList.contains(e.target) && !optionButton.contains(e.target)) {
        optionList?.classList.add('hidden');
      }
    };

    optionButton?.addEventListener('click', handleToggle);
    document.addEventListener('click', handleClickOutsideTarget);

    return () => {
      optionButton?.removeEventListener('click', handleToggle);
      document.removeEventListener('click', handleClickOutsideTarget);
    };
  }, []);

  return (
    <div className={`size-8 flex items-center justify-center ${className}`}>
      <button ref={optionButtonRef} className="size-full cursor-pointer">
        <EllipsisVertical color="white" className="size-full" />
      </button>

      <ul
        ref={optionListRef}
        className="absolute bg-(--charc) h-[50vh] w-[250px] z-3 right-0 top-full my-2 rounded-md shadow-2xl hidden flex-col justify-start p-2 gap-1 list-none"
      >
        <li className="flex items-center justify-between">
          <SettingsEnum name="content" label="Content" className="w-1/2" />
        </li>

        {AddToMenu.length &&
          AddToMenu.map((item, idx) => {
            return (
              <li key={idx} className="flex items-center justify-between">
                {item}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default KebabMenuButton;
