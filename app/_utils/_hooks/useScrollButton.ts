import { useRef, useState, useEffect, useCallback } from 'react';
import { useMergedRef } from '@mantine/hooks';

export const useScrollButton = (containerRef: React.RefObject<HTMLElement>) => {
  const targetElementRef = useRef<HTMLDivElement | null>(null); // Track the target element
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const target = targetElementRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      {
        root: container, // Observe within the scrollable container
        rootMargin: '64px',
      },
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (!!target) {
        observer.unobserve(target);
      }
    };
  }, [containerRef]);

  const scrollIntoView = useCallback(() => {
    if (containerRef.current && targetElementRef.current) {
      containerRef.current.scrollTo({
        top:
          targetElementRef.current.offsetTop - containerRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [containerRef]);

  return {
    ref: useMergedRef(targetElementRef), // Combine refs if necessary
    isInViewport,
    scrollIntoView,
  };
};
