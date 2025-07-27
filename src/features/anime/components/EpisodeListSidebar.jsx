import { useCallback, useState, useMemo } from 'react';
import debounce from '../../../lib/utils/debounce';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { splitIntoChunks } from '../../../lib/utils/utils';

const renderBatch = (q, episodes) => {
  const queryEp = Number(q);
  const batchSize = 100;

  for (let i = 0; i < episodes.length; i += batchSize) {
    const batch = episodes.slice(i, i + batchSize);
    const found = batch.find((ep) => Number(ep.key) + 1 === queryEp);

    if (found) {
      return batch;
    }
  }

  return episodes.slice(0, batchSize);
};

// const foo = splitIntoChunks(
//   [
//     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
//     22, 23, 24, 25, 26, 27, 28,
//   ],
//   5
// );
// console.log(foo);

function EpisodeListSidebar({ episodes = [], episode }) {
  const navigate = useNavigate();
  console.log(episode);

  const addActive = useCallback(
    (node, ep) => {
      if (!node) return;
      if (
        node.getAttribute('data-ep') === episode ||
        node.getAttribute('data-ep') === ep
      ) {
        const styles = ['border-s-4', 'border-blue-600', '!text-blue-500'];
        const buttons = document.querySelectorAll('[data-ep] button');
        buttons.forEach((btn) => {
          styles.forEach((style) => {
            btn.classList.remove(style);
          });
        });

        const activeBtn = node.querySelector('button');
        styles.forEach((style) => {
          activeBtn.classList.add(style);
        });

        node.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [episode]
  );

  const [query, setQuery] = useState(episode);

  const episodeList = useMemo(() => {
    return episodes.map((ep, i) => {
      const attrs = {
        'data-ep': i + 1,
      };

      return (
        <li
          key={i}
          ref={addActive}
          {...attrs}
          className="size-fit w-full group border-(--blue)"
        >
          <button
            title={ep.title}
            onClick={debounce((e) => {
              const parent = e.target.closest('[data-ep]');
              addActive(parent, parent.getAttribute('data-ep'));
              navigate(`?ep=${i + 1}`);
            }, 200)}
            type="button"
            className="text-white flex cursor-pointer text-start py-2 ps-3 size-full after group-hover:bg-neutral-600 focus:outline-0 focus:bg-neutral-600"
          >
            <span className="font-semibold line-clamp-1 w-8/10">{`${i + 1}. ${
              ep.title
            }`}</span>
            <PlayCircle className="size-6 shrink" />
          </button>
        </li>
      );
    });
  }, [episodes]);

  const find = useCallback(
    debounce((selector = '') => {
      const target = document.querySelector(selector);
      const btn = target.querySelector('button');
      target.scrollIntoView({ behavior: 'smooth' });
      btn.focus();
    }, 200),
    []
  );

  return (
    <aside className="h-[50vh] grow grid grid-cols-1 grid-rows-10 w-full md:w-3/9 lg:w-2/9 bg-neutral-900 md:h-[90vh]">
      <div className="flex justify-center items-end gap-2 flex-col px-2 py-1 row-span-1">
        <div className="flex w-full justify-between">
          <label htmlFor="search-ep" className="text-neutral-200 font-semibold">
            Episodes:
          </label>
          <input
            onChange={debounce((e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              e.target.value = val;
              setQuery(val);
              find(
                `[data-ep = "${
                  val > episodeList.length || !val ? episode : val || episode
                }"]`
              );
            })}
            type="number"
            placeholder="Episode number"
            className="text-neutral-200 border-0 outline-2 outline-neutral-300 ps-1 rounded-sm"
            id="search-ep"
          />
        </div>
        <select
          className="grow-0 border-2 text-white border-neutral-300 rounded-md cursor-pointer"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        >
          {splitIntoChunks(episodeList, 100).map((ep, i) => {
            const start = Number(ep[0].key) + 1;
            return (
              <option value={start} key={i} className="bg-(--dark) text-white">
                {`${start} -${Number(ep.at(-1).key) + 1}`}
              </option>
            );
          })}
        </select>
      </div>
      <ul className="h-full flex flex-col gap-x-0.5 justify-start items-center overflow-auto shrink-0 row-span-9 rm-scrollbar bg-neutral-800">
        {episodeList.length > 100
          ? renderBatch(
              (query > episodeList.length ? episode : query) || episode,
              episodeList
            )
          : episodeList}

        {!episodeList.length &&
          Array.from({ length: 15 }, (_, i) => {
            return (
              <li
                key={i}
                className="w-10/11 p-4 skeleton-load m-1 !rounded-md"
              ></li>
            );
          })}
      </ul>
    </aside>
  );
}

export default EpisodeListSidebar;
