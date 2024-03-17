"use client";

import { ReactNode, useEffect, useRef } from "react";

function AutoScroller({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  const automaticHorizontalScroll = () => {
    if (box.current) {
      box.current.scrollLeft += 0.5;

      if (box.current.scrollLeft >= box.current.scrollWidth - 10) {
        box.current.scrollLeft = 0;
      }

      if (box.current.scrollLeft === 0) {
        box.current.scrollLeft = box.current.scrollWidth;
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(automaticHorizontalScroll, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={box}
      className="max-w-full flex overflow-y-auto gap-2 no-scrollbar"
    >
      {children}
    </div>
  );
}

export default AutoScroller;
