"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

export interface AnimatedListProps {
  initLength?: number;
  maxLength?: number;
  isInfinite?: boolean;
  isPaused?: boolean;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({
    initLength = 0,
    maxLength = Infinity,
    isInfinite = false,
    isPaused = false,
    className,
    children,
    delay = 1500,
  }: AnimatedListProps) => {
    const [index, setIndex] = useState(initLength);
    const childrenArray = useMemo(() => {
      const baseChildrenArray = React.Children.toArray(children);
      if (index > maxLength && isInfinite) {
        const preAddChildrenArray = Array.from({
          length: index + 1 - (baseChildrenArray.length - 1),
        }).map((_, index) => {
          const childrenIndex = index % baseChildrenArray.length;
          return baseChildrenArray[childrenIndex];
        });
        return [...baseChildrenArray, ...preAddChildrenArray];
      }

      return baseChildrenArray;
    }, [children, index, maxLength, isInfinite]);

    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout =
          !isPaused &&
          setTimeout(() => {
            setIndex((prevIndex) => {
              return prevIndex + 1;
            });
          }, delay);

        return () => {
          if (typeof timeout !== "boolean") {
            return clearTimeout(timeout);
          }
        };
      }
    }, [index, delay, childrenArray.length, isPaused]);

    const itemsToShow = useMemo(() => {
      const result = childrenArray
        .slice(0, index + 1)
        .reverse()
        .slice(0, maxLength)
        .reverse();

      return result;
    }, [index, childrenArray, maxLength]);

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence>
          {itemsToShow.map((item) => {
            return (
              <AnimatedListItem key={(item as React.ReactElement).key}>
                {item}
              </AnimatedListItem>
            );
          })}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      originY: "bottom",
    },
    exit: {
      marginBottom: -16,
      width: 0,
      height: 0,
      scale: 0,
      opacity: 0,
      originY: "bottom",
    },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
