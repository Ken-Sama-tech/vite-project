import { useCallback, useRef } from 'react';

function useObserver(cb = () => {}, deps = []) {
  const observerRef = useRef(null);

  return useCallback((node) => {
    let observer = observerRef?.current;

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        cb();
        observer.unobserve(node);
      }
    });

    if (node) observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, deps);
}

export default useObserver;
