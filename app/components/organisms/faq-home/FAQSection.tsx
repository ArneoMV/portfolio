"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/app/components/molecules/section-header/SectionHeader";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most websites take between 2–6 weeks, depending on scope. Smaller landing pages can be done faster, while larger or more complex projects take more time.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "Usually a short brief, your goals, any existing brand materials, and examples of websites or products you like. If you do not have everything ready, I can help define it with you.",
  },
  {
    question: "Do you work with specific technologies?",
    answer:
      "Yes. I usually work with Figma for design and modern web technologies such as Next.js for development. The exact stack depends on the project requirements.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. I can help with smaller improvements, design updates, bug fixes, and future feature iterations after the initial launch.",
  },
  {
    question: "Do you handle both design and development?",
    answer:
      "Yes. I can work on both product design and frontend development, which helps reduce handoff gaps and keeps the process faster and more consistent.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes. I can review the current website, identify usability and visual issues, and redesign it into a cleaner, more useful experience.",
  },
  {
    question: "What if I only need design, not development?",
    answer:
      "That is completely fine. I can deliver design files, prototypes, flows, and developer-ready handoff documentation without doing the development part.",
  },
  {
    question: "How do we communicate during the project?",
    answer:
      "We can communicate through email, Slack, Google Meet, or any setup that works best for the project. I usually keep communication structured and lightweight.",
  },
];

// The plus asset ships with a literal `+` in the filename
// (`+_icon.svg`). URL-encode it to `%2B` so the browser fetches the
// exact file rather than treating `+` as a reserved character.
const PLUS_ICON = "/images/home/%2B_icon.svg";
const X_ICON = "/images/home/x_icon.svg";

/**
 * Homepage FAQ section — single-open-at-a-time accordion in a
 * 2-column grid (1 column on mobile). Sits inside the same dotted-
 * guides container as Services. The first item is open by default.
 *
 * Accordion expand uses the grid-template-rows: 0fr → 1fr trick on a
 * wrapping `.faq-panel`, with `overflow: hidden` on `.faq-panel-inner`.
 * That gives a smooth height transition without hardcoding a
 * max-height, and because the wrapper's computed height actually
 * changes, following items reflow downward naturally — no overlap.
 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Items 0–3 render in the left column, items 4–7 in the right
  // column. Index `i` stays global so the toggle handler and
  // aria-controls ids don't need a column-aware rewrite.
  const renderFaqItem = (item: FaqItem, i: number) => {
    const isOpen = openIndex === i;
    const triggerId = `faq-${i}-trigger`;
    const panelId = `faq-${i}-panel`;
    return (
      <div
        key={item.question}
        className={`faq-item${isOpen ? " faq-item--open" : ""}`}
      >
        <button
          type="button"
          id={triggerId}
          className="faq-trigger"
          onClick={() => toggle(i)}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <Image
            src={isOpen ? X_ICON : PLUS_ICON}
            alt=""
            width={18}
            height={18}
            className="faq-icon"
          />
          <span className="faq-question">{item.question}</span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="faq-panel"
        >
          <div className="faq-panel-inner">
            <p className="faq-answer">{item.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Shared SectionHeader — same molecule used by Services. */}
        <SectionHeader
          title="Additional answers"
          subtitle="If you still have the questions, the answers might be here. You can always find out more by asking us."
        />

        {/* Two independent flex columns — opening an item in one
            column only reflows that column's items. Previously this
            was a single grid where row heights were synchronized
            across both columns, which dragged the wrong items
            downward when an item expanded. */}
        <div className="faq-grid">
          <div className="faq-column">
            {FAQ_ITEMS.slice(0, 4).map((item, j) => renderFaqItem(item, j))}
          </div>
          <div className="faq-column">
            {FAQ_ITEMS.slice(4, 8).map((item, j) =>
              renderFaqItem(item, j + 4),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
