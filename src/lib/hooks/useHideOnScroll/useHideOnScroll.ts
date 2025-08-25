import { useEffect, useRef, useState } from 'react';

const HIDE_OFFSET = 10;

export function useHideOnScroll() {
  const lastY = useRef(0);
  const isTicking = useRef(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      if (isTicking.current) return;
      isTicking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const diffY = y - lastY.current;

        if (y < 50) setHidden(false);
        if (Math.abs(diffY) > HIDE_OFFSET) {
          setHidden(diffY > 0);
          lastY.current = y;
        }

        isTicking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return hidden;
}
