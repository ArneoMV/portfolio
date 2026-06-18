import type { ProjectDetailMeta } from "@/app/components/organisms/project-detail/project-detail.types";
import type {
  CaseStudyStat,
  CaseStudyTextRow,
  CaseStudyImage,
} from "@/app/components/organisms/project-detail/case-study/case-study.types";

/**
 * Standalone data shape for the Croatel / HRT case study.
 *
 * Like Neogov and Spona, Croatel renders through a dedicated bespoke
 * page (`CroatelProjectPage`) rather than the shared
 * `ProjectDetailTemplate`. Two structural differences from the other
 * two:
 *   • the hero is a banner-only composition (no gradient panel / overlay
 *     text) with the Croatel + HRT logos rendered below the image; and
 *   • the light section is a bespoke alternating layout
 *     (`CroatelLightSection`), not the shared image-pair pattern.
 *
 * The dark Context section reuses `CaseStudyContextSection`; the
 * `insideRows` carry optional `images` (the additive
 * `CaseStudyTextRow.images` field) so the section can interleave
 * label/text rows with one or more vertically stacked images.
 *
 * The minimal Croatel entry in `PROJECT_DETAILS` is retained for
 * `generateStaticParams`, `generateMetadata`, and the "Other Work"
 * cards; THIS constant is the source of truth for the /work/croatel
 * detail page.
 */
export interface CroatelProjectData {
  slug: string;
  title: string;
  meta: ProjectDetailMeta;
  description: string;
  introduction: string;

  /* ── Hero (project-specific, banner-only, no gradient panel) ── */
  heroBannerImage: { src: string; alt: string };
  /** Clickable Croatel wordmark + HRT client logo. Both opened in a
   *  new tab via the shared `ProjectLogo` component; rendered height
   *  is locked at 40px so the two wordmarks line up regardless of
   *  intrinsic dimensions. */
  croatelLogo: {
    src: string;
    alt: string;
    href: string;
    width: number;
    height: number;
  };
  hrtLogo: {
    src: string;
    alt: string;
    href: string;
    width: number;
    height: number;
  };

  /* ── Dark Context section (CaseStudyContextSection) ── */
  leadQuote: string;
  stats: CaseStudyStat[];
  contextRow: CaseStudyTextRow & { images?: CaseStudyImage[] };
  /** Each inside row may carry optional trailing images (stacked). */
  insideRows: CaseStudyTextRow[];

  /* ── Light section (project-specific, CroatelLightSection) ── */
  lightSection: {
    brandFluency: { label: string; text: string; image: CaseStudyImage };
    volumeAndPace: {
      label: string;
      text: string;
      imageStack: CaseStudyImage[];
    };
    whatItSetUp: {
      label: string;
      text: string;
      images: [CaseStudyImage, CaseStudyImage];
    };
    reflection: {
      label: string;
      text: string;
      images: CaseStudyImage[];
      finalParagraph: string;
    };
  };
}

export const CROATEL_PROJECT: CroatelProjectData = {
  slug: "croatel",
  title: "Croatel",
  meta: {
    responsibility: "Graphic Design",
    projectType: "Broadcast Production",
    industry: "Television / Media",
    year: "2020-2022",
  },
  description:
    "Designed broadcast graphics for HRT1's news programming, working in a live TV environment where decisions had to be fast, clear, and on brand every day.",
  introduction:
    "Croatel produced broadcast graphics for HRT1, Croatia's main national television channel. I worked in the news department, designing graphics and motion visuals used in live programming. The work spanned Dnevnik, Vijesti u 17, sports, weather, culture segments, and the talk show Otvoreno. Live TV doesn't wait, which meant the design process had to fit inside very small windows without sacrificing visual clarity.",

  // ── Hero ──────────────────────────────────────────────────
  heroBannerImage: {
    src: "/images/projects/croatel/hrt_hero_image.png",
    alt: "Croatel broadcast graphics composition with Zagreb, celebrations, politicians, sport, and culture imagery",
  },
  // Switched from the project-local PNGs to the shared SVG wordmarks
  // in /public/images/home/ — same files the homepage Projects list
  // uses. Existing PNGs (logo_Croatel.png, HRT_logo 1.png) stay on
  // disk unreferenced. Filename "Coatel_Logo.svg" is the asset's
  // existing typo, kept verbatim so the path resolves.
  croatelLogo: {
    src: "/images/home/Coatel_Logo.svg",
    alt: "Croatel",
    href: "https://www.croatel.hr/",
    width: 185,
    height: 32,
  },
  hrtLogo: {
    src: "/images/home/HRT_Logo.svg",
    alt: "HRT (Croatian Radiotelevision)",
    href: "https://www.hrt.hr/",
    width: 66,
    height: 32,
  },

  // ── Dark Context section ──────────────────────────────────
  leadQuote:
    "Designing for live television means viewers see your work for seconds, not minutes. Every graphic has to communicate the story before the next one replaces it on screen.",
  stats: [
    { value: "1,000+", label: "graphics per year", variant: "stat" },
    { value: "400,000+", label: "viewers per show", variant: "stat" },
    {
      value: "6 shows",
      label: "Dnevnik, Vijesti, Sport, Vremenska, Kultura, Otvoreno",
      variant: "stat",
    },
  ],
  contextRow: {
    label: "Context",
    text: "HRT1 is the most watched television channel in Croatia, and Dnevnik is its flagship news program. The graphics I designed appeared behind anchors, on video walls, and over footage during live broadcasts. Most of the work was 2D graphics for news segments, with occasional motion work in After Effects for transitions or feature pieces. The challenge wasn't the tools, it was the pace.",
    images: [
      {
        src: "/images/projects/croatel/hrt_mockup_tv_01.png",
        alt: "Croatel TV showing 30-year anniversary broadcast graphic",
      },
    ],
  },
  insideRows: [
    {
      label: "The system inside the chaos",
      text: "Working on a news program means producing dozens of graphics a day, often with little time between when an editor needs something and when it airs. Early on, I started building a reusable template base and a library of clean PNG assets so the team could move faster without losing visual consistency. That asset library became the closest thing to a design system the department had, and it shaped how I thought about reusability long before I moved into product design.",
      images: [
        {
          src: "/images/projects/croatel/hrt_mockup_studio_02.png",
          alt: "Reusable template variations and PNG asset library examples",
        },
        {
          src: "/images/projects/croatel/hrt_mockup_studio_01.png",
          alt: "Broadcast graphics for news segments showing political and institutional figures",
        },
      ],
    },
  ],

  // ── Light section ─────────────────────────────────────────
  lightSection: {
    brandFluency: {
      label: "Brand fluency",
      text: "Every graphic had to recognize a brand in some way. A sports club logo, a museum identity, a political figure, a government institution. The job wasn't deep brand work, but it required reading a brand fast and matching its visual language well enough that viewers could place it instantly. Doing that hundreds of times across two years builds a kind of visual fluency that's hard to learn any other way. Living in the center of Zagreb, I also started carrying a camera off shift, photographing buildings and events around the city. Those photos worked their way into the graphics over time, a small in-house alternative to relying on stock.",
      image: {
        src: "/images/projects/croatel/hrt_mockup_studio_03.png",
        alt: "Brand graphics for sports clubs, museums, and government institutions",
      },
    },
    volumeAndPace: {
      label: "Volume and pace",
      text: "The volume was significant. Looking back through the folders I kept, organized by date, I produced around a thousand finished graphics per year. Some of those were variations on templates, others were built from scratch around a breaking story. The Photoshop skills I had before this job were good. By the end of it, they were sharp in a way that only daily repetition can produce.",
      imageStack: [
        {
          src: "/images/projects/croatel/hrt_image_01.png",
          alt: "Broadcast graphic 1",
        },
        {
          src: "/images/projects/croatel/hrt_image_02.png",
          alt: "Broadcast graphic 2",
        },
        {
          src: "/images/projects/croatel/hrt_image_03.png",
          alt: "Broadcast graphic 3",
        },
        {
          src: "/images/projects/croatel/hrt_image_04.png",
          alt: "Broadcast graphic 4",
        },
        {
          src: "/images/projects/croatel/hrt_image_05.png",
          alt: "Broadcast graphic 5",
        },
        {
          src: "/images/projects/croatel/hrt_image_06.png",
          alt: "Broadcast graphic 6",
        },
      ],
    },
    whatItSetUp: {
      label: "What it set up",
      text: "Croatel was my first real lesson in designing systems instead of one-off deliverables. The reusable templates, the organized asset folders, the patterns shared across the team. None of it was called design systems work at the time, but the instinct was the same. When I moved into product design later, the way I thought about components, patterns, and shared foundations was already shaped by what live television had taught me.",
      images: [
        {
          src: "/images/projects/croatel/hrt_mockup_tv_02.png",
          alt: "TV mockup showing DANTE 700 broadcast graphic",
          caption: "Dimitrije Popović - Dimitrije i Dante",
        },
        {
          src: "/images/projects/croatel/hrt_mockup_tv_03.png",
          alt: "TV mockup showing UK Festival graphic",
          caption: "13. Festival mediteranskog filma Split",
        },
      ],
    },
    reflection: {
      label: "Reflection",
      text: "Live television had its own kind of intensity that nothing else really replaces. The work was repetitive and dynamic at the same time, with the same deadlines every day but a different story behind each graphic. Looking back, what stayed with me wasn't any single piece I made. It was the habit of working fast without compromising on what landed on screen.",
      images: [
        {
          src: "/images/projects/croatel/hrt_mockup_studio_04.png",
          alt: "Composite of broadcast graphics across sport, culture, and news segments",
        },
      ],
      finalParagraph:
        "Every now and then I still catch one of my old graphics on air. The shifts are long gone, but the work stuck around.",
    },
  },
};
