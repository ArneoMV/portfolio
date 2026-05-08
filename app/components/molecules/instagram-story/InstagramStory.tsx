"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Button from "@/app/components/atoms/button/Button";

const SLIDE_DURATION = 3500;

const BAR_COLORS = [
  "var(--color-orange-50)",
  "var(--color-primary-60)",
  "var(--color-green-60)",
  "var(--color-red-50)",
];

interface InstagramStoryProps {
  images: string[];
  username: string;
  avatarSrc: string;
  profileUrl: string;
}

export default function InstagramStory({
  images,
  username,
  avatarSrc,
  profileUrl,
}: InstagramStoryProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  const slideCount = images.length;

  const goToSlide = useCallback(
    (index: number) => {
      setActiveSlide(index % slideCount);
      setProgress(0);
      startTimeRef.current = Date.now();
    },
    [slideCount],
  );

  const nextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % slideCount);
  }, [activeSlide, slideCount, goToSlide]);

  // Animation loop for progress
  useEffect(() => {
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(p);

      if (p >= 1) {
        setActiveSlide((prev) => (prev + 1) % slideCount);
        startTimeRef.current = Date.now();
        setProgress(0);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [activeSlide, slideCount]);

  return (
    <div
      className="insta-image relative flex aspect-[9/16] w-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-neutral-100)]"
      onClick={nextSlide}
    >
      {/* Background images */}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Story ${i + 1}`}
          fill
          className="object-cover transition-opacity duration-500 ease-in-out"
          style={{ opacity: i === activeSlide ? 1 : 0 }}
          sizes="(max-width: 767px) 100vw, 50vw"
          priority={i === 0}
        />
      ))}

      {/* Top overlay gradient */}
      <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Progress bars */}
      <div className="relative z-20 flex gap-[4px] px-[var(--space-sm)] pt-[var(--space-sm)]">
        {images.map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 cursor-pointer overflow-hidden rounded-full bg-white/30"
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(i);
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                width:
                  i < activeSlide
                    ? "100%"
                    : i === activeSlide
                      ? `${progress * 100}%`
                      : "0%",
                transition: i === activeSlide ? "none" : "width 0.3s ease",
              }}
            />
          </div>
        ))}
      </div>

      {/* Username header */}
      <div className="relative z-20 flex items-center gap-[var(--space-xs)] px-[var(--space-sm)] pt-[var(--space-xs)]">
        <div className="relative h-[28px] w-[28px] overflow-hidden rounded-full border-[2px] border-white/60">
          <Image
            src={avatarSrc}
            alt={username}
            fill
            className="object-cover"
            sizes="28px"
          />
        </div>
        <span className="text-[var(--text-caption)] font-medium text-white/90">
          {username}
        </span>
      </div>

      {/* See more button */}
      <div className="relative z-20 mt-auto flex justify-center pb-[var(--space-lg)]">
        <Button
          variant="light"
          size="sm"
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          See more
        </Button>
      </div>
    </div>
  );
}
