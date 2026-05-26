/**
 * LinkedIn recommendations rendered in the homepage "Trusted by
 * colleagues" section (`RecommendationsSection`). Six fixed entries —
 * order here drives both the deterministic scatter transforms (by
 * index) and the colour assignment, so keep the array length and
 * ordering in sync with `SCATTER_TRANSFORMS` in the component.
 *
 * `avatar` files live in `/public/images/home/testemonials/` as
 * `.png`; `color` maps to a `.recommendation-card--{color}`
 * background variant in `_recommendations.scss`.
 */
export interface Recommendation {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  color: "blue" | "green" | "peach" | "red" | "pink" | "purple";
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "danijel-rajic",
    quote:
      "Arneo brings fresh ideas grounded in user needs. His detail-oriented mindset ensures designs are creative and execution-ready.",
    name: "Danijel Rajić",
    role: "Product Manager at NEOGOV",
    avatar: "/images/home/testemonials/testemonial_danijel.png",
    color: "blue",
  },
  {
    id: "julio-ramirez",
    quote:
      "Arneo jumped in quickly and brought strong UX thinking to complex work. Polished visual execution, dependable, and a real sense of ownership.",
    name: "Julio Ramirez",
    role: "Senior Product Designer at Buildops",
    avatar: "/images/home/testemonials/testemonial_julio.png",
    color: "green",
  },
  {
    id: "tihor-nezic",
    quote:
      "Arneo's work ethics are remarkable and his ability to output work in a timely manner is really impressive. An excellent team player.",
    name: "Tihor Nezić",
    role: "Frontend Engineer at TradeLocker",
    avatar: "/images/home/testemonials/testemonial_tihor.png",
    color: "peach",
  },
  {
    id: "petar-kleskovic",
    quote:
      "Arneo works effectively under pressure, takes feedback constructively, and consistently delivers high-quality work on tight deadlines.",
    name: "Petar Klesković",
    role: "JavaScript Developer at Q Agency",
    avatar: "/images/home/testemonials/testemonial_petar.png",
    color: "red",
  },
  {
    id: "sandra-serbec",
    quote:
      "Arneo is intelligent and deeply creative, with a great eye for detail. Reliable, professional, and a positive influence in stressful times.",
    name: "Sandra Šerbec",
    role: "2D/3D Graphic Designer at Croatel",
    avatar: "/images/home/testemonials/testemonial_sandra.png",
    color: "pink",
  },
  {
    id: "ella-gracin",
    quote:
      "Arneo never backs down from a challenge and works well under pressure. Constantly learning and always willing to share his knowledge.",
    name: "Ella Gracin",
    role: "Designer at Croatel",
    avatar: "/images/home/testemonials/testemonial_ella.png",
    color: "purple",
  },
];
