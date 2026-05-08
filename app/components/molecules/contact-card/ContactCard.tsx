import Image from "next/image";
import type { CSSProperties } from "react";

export interface ContactCardData {
  title: string;
  href: string;
  side: "left" | "right";
  bgColor: string;
  image?: string;
  rotation?: number;
  offset?: { top?: string; left?: string };
  labelPosition?: "left" | "right";
}

export default function ContactCard({
  title,
  href,
  bgColor,
  image,
  rotation = 0,
  offset,
  labelPosition = "left",
}: ContactCardData) {
  const style = {
    "--card-rotation": `${rotation}deg`,
    "--card-top": offset?.top ?? "0%",
    "--card-left": offset?.left ?? "0%",
    backgroundColor: bgColor,
  } as CSSProperties;

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="contact-card"
      style={style}
      aria-label={title}
    >
      {image && (
        <div className="contact-card-image">
          <Image
            src={image}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 767px) 60vw, 22vw"
          />
        </div>
      )}

      <span
        className="contact-card-label font-[family-name:var(--font-tech)]"
        data-position={labelPosition}
      >
        {title}
      </span>
    </a>
  );
}
