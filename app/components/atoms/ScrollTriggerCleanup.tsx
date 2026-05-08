"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap/gsap-init";

/**
 * Kills all GSAP ScrollTriggers on route change so pinned elements
 * are restored to their original DOM parents before React unmounts them.
 */
export default function ScrollTriggerCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // On every route change, kill all existing ScrollTriggers.
    // This runs before the new page's useEffects create fresh ones.
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname]);

  return null;
}
