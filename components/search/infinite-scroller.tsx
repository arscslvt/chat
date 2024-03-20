"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import "./infinite-scroller.css";
import { cx } from "class-variance-authority";

interface InfiniteScollerProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
}

function InfiniteScoller({
  children,
  duration = 40,
  ...props
}: InfiniteScollerProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollerInner = useRef<HTMLDivElement>(null);

  const [isPopulated, setPopulated] = useState(false);

  const [durationByScreen, setDurationByScreen] = useState<number>(duration);

  useEffect(() => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      setDurationByScreen(duration * 2);
    }

    setDurationByScreen(duration);
  }, [duration]);

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!scrollerInner.current) return;

    if (!isActive) {
      return scrollerInner.current.setAttribute(
        "data-scrolling-active",
        "false"
      );
    }

    scrollerInner.current.setAttribute("data-scrolling-active", "true");
  }, [isActive, scrollerInner]);

  const addAnimation = useCallback(() => {
    if (isPopulated) return;
    if (!scrollerInner.current) return;

    const scrollerInnerContent = Array.from(scrollerInner.current.children);

    scrollerInnerContent.map((item, key) => {
      const clonedItem = item.cloneNode(true) as HTMLElement;
      clonedItem.setAttribute("aria-hidden", "true");
      clonedItem.setAttribute("key", key.toString());

      scrollerInner.current?.appendChild(clonedItem);
    });

    setPopulated(true);
  }, [scrollerInner, isPopulated]);

  useEffect(() => {
    if (!scroller.current) return;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scroller.current.setAttribute("data-animated", "true");

      addAnimation();
    }
  }, [scroller, addAnimation]);

  return (
    <div
      ref={scroller}
      className={cx("as-scroller no-scrollbar", props.className)}
      onMouseOver={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(true)}
      onTouchStart={() => setIsActive(false)}
      onTouchEnd={() => setIsActive(true)}
    >
      <div
        ref={scrollerInner}
        className="as-scroller-inner select-none"
        style={
          {
            "--scroller-duration": `${durationByScreen}s`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

export default InfiniteScoller;
