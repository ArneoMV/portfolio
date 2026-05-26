import type { ProjectDetail } from "@/app/components/organisms/project-detail/project-detail.types";

/*
 * Per-project case-study data for `/work/[slug]`. Each entry is the
 * sole source for its detail page: hero text + meta grid, the
 * introduction paragraph, and the dark-band section's left text +
 * right-column block list. Each project's content is fully
 * independent — the previous shared `SHARED_INTRO` / `SHARED_DARK_*`
 * constants and the `makeDarkRightBlocks` helper have been removed so
 * a copy edit on one project can't drift into another.
 *
 * What's real and what's placeholder right now:
 *   • `introduction` is a real first-pass draft on each of the 4
 *     projects (NEOGOV / Elite Digital / Spona / Croatel). Edit
 *     freely.
 *   • `description` (the short blurb beside the type-of-work label)
 *     is still lorem on every project — not in scope for the current
 *     draft round. Replace per project when ready.
 *   • `darkSection.leftText` and the four text blocks inside
 *     `darkSection.rightBlocks` are placeholder lorem (identical
 *     across projects right now) — the inlining is structural so the
 *     copy can be replaced per project without touching the others.
 *   • `darkSection.rightBlocks` IMAGE BLOCKS are intentionally left
 *     without `src`. They render as neutral grey placeholders via
 *     SCSS background and will be wired to real asset paths per
 *     project when each case study's visuals are ready. Alt text is
 *     still set so SR users hear the right project name.
 *   • `meta` values were copied forward from the previous data and
 *     have NOT been audited for accuracy — NEOGOV's `industry:
 *     "Sports & Activity"` and `projectType: "Website design"` in
 *     particular look wrong (NEOGOV is a US-gov HR SaaS) and should
 *     be reviewed in a follow-up.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  // NOTE: Neogov's /work/neogov DETAIL PAGE no longer renders from
  // this entry — it has a dedicated page (`NeogovProjectPage`) backed
  // by `NEOGOV_PROJECT` in `app/data/neogov-project.data.ts`. This
  // entry is intentionally retained because:
  //   • `getOtherProjects()` walks this array to show Neogov as an
  //     "Other Work" card on the other projects' pages.
  //   • `generateStaticParams()` maps this array to emit the neogov
  //     static path.
  // Keep the listing-relevant fields (slug, title, heroImage,
  // heroImageAlt, description, tags) in sync with NEOGOV_PROJECT. The
  // darkSection lorem below is now dead for rendering purposes (the
  // detail page ignores it) — left intact only so the entry satisfies
  // the required `ProjectDetail` shape without weakening the shared
  // type. Edit real Neogov case-study content in NEOGOV_PROJECT.
  {
    slug: "neogov",
    title: "Neogov",
    typeOfWorkLabel: "Challenge",
    description:
      "Enterprise HR SaaS used by 13,000+ US public sector agencies. Worked across product flows and the design system that holds them together.",
    heroImage: "/images/home/work-project-01.png",
    heroImageAlt: "Neogov project preview",
    meta: {
      responsibility: "UI/UX Design",
      projectType: "Product / SaaS",
      industry: "Government / HR Tech",
      year: "2022 – 2024",
    },
    introduction:
      "NEOGOV is the HR platform behind counties, school districts, and city halls across the United States. I started on product flows for eForms, Onboard, and Analytics, then joined the design system team to work on the patterns and components those products share. A lot of the work came down to one question: how do you change something in one place without breaking it in five others. Toward the end I helped coordinate AI feature integration across the platform, which mostly meant translating product decisions into design system patterns that could actually scale.",
    darkSection: {
      leftText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      rightBlocks: [
        {
          type: "text",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        { type: "image", alt: "Neogov interface detail" },
        {
          type: "text",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        },
        { type: "image", alt: "Neogov visual detail" },
        {
          type: "text",
          content:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        },
        { type: "image", alt: "Neogov process detail" },
        {
          type: "text",
          content:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
        },
      ],
    },
    tags: ["UI Design"],
    otherWorkCard: {
      image: {
        src: "/images/projects/other_work/other_neogov.png",
        alt: "Neogov product UI composition",
      },
      label: "Enterprise design system for HR SaaS",
      description:
        "Worked on NOVI, the design system powering NEOGOV's product platform serving 13,000+ US public sector agencies.",
      tag: "Design System",
    },
  },
  {
    slug: "elite-digital",
    title: "Elite Digital",
    typeOfWorkLabel: "What I built",
    description:
      "Digital agency delivering web products across multiple industries. Built the design system and component library that lets them ship fast without losing consistency.",
    heroImage: "/images/projects/elite-digital/elite-digital-hero-image.png",
    heroImageAlt:
      "Elite Digital project hero showing the design for fast delivery case study",
    meta: {
      responsibility: "UI/UX Design",
      projectType: "Web / Marketing",
      industry: "Digital Agency",
      year: "2025",
    },
    introduction:
      "Elite Digital is an agency that designs and builds websites at agency pace, which usually means fast. I worked on structure and layout systems, shared components, and the documentation around them, so the team could keep extending things after handoff without a designer in the loop for every change. The brief was as much about flexibility as polish.",
    darkSection: {
      leftText:
        "A design collaboration set up to help the team move faster, where I set the direction and foundation, then handed it off for implementation.",
      rightBlocks: [
        {
          type: "text",
          content:
            "Elite Digital is a full service digital agency in Zagreb that delivers across web, branding, marketing, and IT support. Over roughly ten months I worked with the team as a freelance design collaborator, focused on the web side of their work.",
        },
        {
          type: "image",
          variant: "illustration",
          height: 240,
          src: "/images/projects/elite-digital/elite-digital-clean-work-flow.png",
          alt: "Early stage design setup and handoff workflow with sticky notes",
        },
        {
          type: "text",
          content:
            "Most of the work happened in Figma, where I built shared layout systems, typography scales, component patterns, and page templates the team could reuse. My focus was on the early stages of each project, then handing the design over to the developer who built the sites in Framer.",
        },
        {
          type: "image",
          variant: "illustration",
          height: 300,
          src: "/images/projects/elite-digital/elite-digital-black-white-mode.png",
          alt: "Design system foundations in Figma with light and dark mode variables",
        },
      ],
    },
    lightSection: {
      rightBlocks: [
        {
          type: "image",
          variant: "responsive",
          src: "/images/projects/elite-digital/mockup-continental-dynamics-01.png",
          alt: "Continental Dynamics website mockup, a European gas and energy trading group",
        },
        {
          type: "text",
          content:
            "These projects were shipped by the wider team after the design foundation was in place, so the final live sites reflect both the design setup and decisions made during build. Setting up shared systems and design direction at the start of a project, knowing the build would carry on without me, is its own kind of design challenge.",
        },
        {
          type: "text",
          content:
            "Part of the work also included Elite Media, the agency's internal subbrand focused on marketing and social media. Designing for a brand that itself sells design and strategy comes with its own kind of pressure, since the site has to reflect the quality of work the team delivers to clients.",
        },
        {
          type: "image",
          variant: "full-width",
          src: "/images/projects/elite-digital/mockups-all.png",
          alt: "Client website mockups for Azimut International, Union Rail, and Elite Digital agency",
        },
      ],
    },
    tags: ["Web Design"],
    otherWorkCard: {
      image: {
        src: "/images/projects/other_work/other_elite_digital.png",
        alt: "Elite Digital agency platform composition",
      },
      label: "Digital agency design system and component library",
      description:
        "Built the design system and component library that lets the team ship fast without losing visual consistency.",
      tag: "UI Design",
    },
  },
  {
    slug: "spona",
    title: "Spona",
    typeOfWorkLabel: "Project context",
    description:
      "B2B SaaS platform connecting companies with digital agencies. Designed the product end-to-end as it grew toward a network of 10,000+ agencies.",
    heroImage: "/images/home/work-project-03.png",
    heroImageAlt: "Spona project preview",
    meta: {
      responsibility: "End-to-End Design",
      projectType: "Product Design",
      industry: "B2B SaaS / Marketplace",
      year: "2020 – 2022",
    },
    introduction:
      "Spona is a B2B platform built to connect companies with the agencies that can actually deliver for them. I came in early and worked across information architecture, user flows, and the dashboards both sides of the marketplace eventually live in. The constant tension was between a tidy enterprise SaaS experience and the speed agencies actually move at, and most of the design choices live somewhere along that line.",
    darkSection: {
      leftText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      rightBlocks: [
        {
          type: "text",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        { type: "image", alt: "Spona interface detail" },
        {
          type: "text",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        },
        { type: "image", alt: "Spona visual detail" },
        {
          type: "text",
          content:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        },
        { type: "image", alt: "Spona process detail" },
        {
          type: "text",
          content:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
        },
      ],
    },
    tags: ["Platform"],
    otherWorkCard: {
      image: {
        src: "/images/projects/other_work/other_spona.png",
        alt: "Spona marketplace platform interface",
      },
      label: "Marketplace platform that scaled to 10K+ agencies",
      description:
        "Shaped the product structure of a two-sided B2B marketplace connecting businesses with digital service providers.",
      tag: "Product Design",
    },
  },
  // Croatel detail page now renders from croatel-project.data.ts
  // (CROATEL_PROJECT). This entry remains for generateStaticParams and
  // the OtherWorkSection listing. Listing-relevant fields (slug, title,
  // heroImage, heroImageAlt, description, tags) are kept in sync with
  // CROATEL_PROJECT; darkSection/meta/introduction below are dead for
  // rendering (the bespoke page ignores them, like Neogov/Spona).
  {
    slug: "croatel",
    title: "Croatel",
    typeOfWorkLabel: "Brief",
    description:
      "Designed broadcast graphics for HRT1's news programming, working in a live TV environment where decisions had to be fast, clear, and on brand every day.",
    heroImage: "/images/projects/croatel/hrt_hero_image.png",
    heroImageAlt:
      "Croatel broadcast graphics composition with Zagreb, celebrations, politicians, sport, and culture imagery",
    meta: {
      responsibility: "UI Design",
      projectType: "Motion / Graphics",
      industry: "Broadcast / TV",
      year: "2018 – 2020",
    },
    introduction:
      "Croatel produces broadcast graphics for HRT1, Croatia's national television. The work covered news, weather, culture, and sports — bumpers, lower-thirds, and motion visuals that had to read at distance on living-room TVs and still feel current. Some pieces ran for a single segment, others ended up in rotation for years.",
    darkSection: {
      leftText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      rightBlocks: [
        {
          type: "text",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        { type: "image", alt: "Croatel interface detail" },
        {
          type: "text",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        },
        { type: "image", alt: "Croatel visual detail" },
        {
          type: "text",
          content:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
        },
        { type: "image", alt: "Croatel process detail" },
        {
          type: "text",
          content:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
        },
      ],
    },
    tags: ["UI Design"],
    otherWorkCard: {
      image: {
        src: "/images/projects/other_work/other_croatel.png",
        alt: "Croatel broadcast graphics composition",
      },
      label: "Broadcast graphics for national television",
      description:
        "Designed daily broadcast graphics for HRT1 news programming, where pace mattered as much as visual clarity.",
      tag: "Graphic Design",
    },
  },
];
