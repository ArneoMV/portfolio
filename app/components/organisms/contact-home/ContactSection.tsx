"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Ship the R3F/rapier bundle only on the client — avoids pulling WASM into SSR.
const ContactScene = dynamic(() => import("./ContactScene"), { ssr: false });

/**
 * Old 3D contact / footer section. Now sits inside the homepage's
 * second `.page-rail-group`, so the dotted vertical rails read
 * continuously across Services → FAQ → About → Footer → Contact.
 *
 * Layout:
 *   - .contact-section keeps the full-bleed dark background so the
 *     section reads as a "dark band" at the bottom of the page.
 *   - .contact-section-inner is a 1100px-centred column that holds
 *     the email title and the canvas host. The canvas is constrained
 *     to that 1100px width so the bouncing 3D objects stay inside
 *     the same visual frame as the rails (R3F reads viewport.width
 *     from the canvas element, so physics walls follow naturally).
 *
 * Two-stage activation:
 *   - sceneMounted: gates whether <ContactScene> is rendered at all.
 *     Flips with a 300px rootMargin so the dynamic chunk download +
 *     GLB asset fetches + WebGL context creation happen BEFORE the
 *     user reaches Contact, instead of being paid on initial homepage
 *     load. Once true, never flipped back — keeping the scene mounted
 *     is cheaper than tearing it down/up on scroll-away.
 *   - spawned: drives the staggered entrance animation inside
 *     ContactScene at the original 10%-visible threshold. Decoupling
 *     it from sceneMounted means the entrance timing the design was
 *     tuned against is preserved exactly — the scene mounts early and
 *     idles, then the bodies spawn at the same moment they always did.
 */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sceneMounted, setSceneMounted] = useState(false);
  const [spawned, setSpawned] = useState(false);

  useEffect(() => {
    if (sceneMounted) return;
    const node = sectionRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSceneMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [sceneMounted]);

  useEffect(() => {
    if (spawned) return;
    const node = sectionRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSpawned(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [spawned]);

  return (
    <section ref={sectionRef} id="contact" className="contact-section">
      <div className="contact-section-inner">
        <div className="contact-header">
          <h2>arneo@mail.hr</h2>
        </div>

        <div className="contact-scene-host">
          {sceneMounted ? <ContactScene spawned={spawned} /> : null}
        </div>
      </div>
    </section>
  );
}
