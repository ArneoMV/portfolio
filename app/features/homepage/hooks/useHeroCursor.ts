import { useRef, useEffect } from "react";

export interface CursorState {
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  isActive: boolean;
  initialized: boolean;
}

export function useHeroCursor(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const cursor = useRef<CursorState>({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false,
    initialized: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      cursor.current.targetX = e.clientX - rect.left;
      cursor.current.targetY = e.clientY - rect.top;
      cursor.current.isActive = true;
    };

    const onMouseLeave = () => {
      cursor.current.isActive = false;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [containerRef]);

  return cursor;
}
