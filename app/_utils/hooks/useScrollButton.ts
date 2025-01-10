import { useRef, useState, useEffect, useCallback } from "react";
import { useMergedRef } from "@mantine/hooks";

export const useScrollButton = (containerRef: React.RefObject<HTMLElement>) => {
  const targetElementRef = useRef<HTMLDivElement | null>(null); // Track the target element
  const [isInViewport, setIsInViewport] = useState(false);

  const updateVisibility = useCallback(() => {
    if (!containerRef.current || !targetElementRef.current) return;

    const container = containerRef.current;
    const target = targetElementRef.current;

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Check if the target is within the container's visible area
    const inViewport =
      targetRect.top >= containerRect.top &&
      targetRect.bottom <= containerRect.bottom;

    setIsInViewport(inViewport);
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      {
        root: container, // Observe within the scrollable container
      }
    );

    if (targetElementRef.current) {
      observer.observe(targetElementRef.current);
    }

    return () => {
      if (targetElementRef.current) {
        observer.unobserve(targetElementRef.current);
      }
    };
  }, [containerRef]);

  const scrollIntoView = useCallback(() => {
    if (containerRef.current && targetElementRef.current) {
      containerRef.current.scrollTo({
        top:
          targetElementRef.current.offsetTop -
          containerRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [containerRef]);

  return {
    ref: useMergedRef(targetElementRef), // Combine refs if necessary
    isInViewport,
    scrollIntoView,
  };
};
