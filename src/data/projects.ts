/* ============================================================================
 *  ✨ PROJECTS — naya project add karna ho toh SIRF yeh file edit karo ✨
 * ============================================================================
 *
 *  Steps:
 *   1. Neeche wale `projects` array me sabse UPAR ek naya { ... } block paste karo
 *      (copy-paste template is file ke bilkul neeche diya hai).
 *   2. title, url, description bhar do. Baaki sab optional hai.
 *   3. Save karo → website pe card, live screenshot, filter tab,
 *      project count — sab apne aap update ho jaayega.
 *
 *  Screenshot apne aap live URL se ban jaata hai (browser me).
 *  Pakki, fast-loading image chahiye toh terminal me:  npm run shots
 *  → /public/projects/ me desktop + mobile screenshots save ho jaayenge,
 *    aur terminal `image:` / `mobileImage:` lines bata dega — bas paste karo.
 *
 *  category: "AI App"  → 02 AI Development section me dikhega
 *  baaki sab (Website, E-commerce, ...) → 03 Web Development section me
 * ========================================================================== */

export type Project = {
  /** Project ka naam */
  title: string;
  /** Live link. Khaali chhod do agar project live nahi hai (tab "In the lab" badge aayega) */
  url?: string;
  /** 1–3 lines me project ke baare me */
  description: string;
  /** Filter tab isi se bante hain — jo bhi naam likhoge, naya tab ban jaayega */
  category: "Website" | "AI App" | "E-commerce" | "Brand" | (string & {});
  /** Tech / services used */
  tags?: string[];
  /** Saal */
  year?: string;
  /** Mera role — e.g. "Design + Dev + Ads" */
  role?: string;
  /** Optional apni screenshot image (public folder ka path ya koi bhi https URL).
   *  `npm run shots` chalao — yeh apne aap bana ke path bata dega */
  image?: string;
  /** Optional mobile screenshot (390px wide) — web project cards me dikhta hai */
  mobileImage?: string;
  /** Card ka accent colour (optional) */
  accent?: string;
  /** true → bada card, top pe dikhega */
  featured?: boolean;
  /** Link/screenshot nahi hai toh designed preview: "hair" | "travel" | "adwiser" */
  mock?: "hair" | "travel" | "adwiser";
};

export const projects: Project[] = [
  {
    title: "AdVynce",
    url: "https://www.advynce.in/",
    image: "/projects/advynce.webp",
    mobileImage: "/projects/advynce-detail.webp",
    description:
      "Digital agency site for AI solutions, performance marketing & web development — with AI-powered lead-qualifying chat and downloadable service pitch decks.",
    category: "Website",
    tags: ["Next.js", "AI Chatbot", "Branding", "Lead Gen"],
    year: "2025",
    role: "Brand · Design · Dev",
    accent: "#ff5a1f",
    featured: true,
  },
  {
    title: "Gabwise Communications",
    url: "https://www.gabwisecommunications.com/",
    image: "/projects/gabwise.webp",
    mobileImage: "/projects/gabwise-detail.webp",
    description:
      "Premium site for a communication-coaching brand — programs like RE:DEFINE, LINGORA, VOCALIS & ALTAVOX, built to turn visitors into discovery calls.",
    category: "Website",
    tags: ["Next.js", "UI/UX", "Conversion Copy", "SEO"],
    year: "2026",
    role: "Design · Dev · SEO",
    accent: "#7c5cff",
    featured: true,
  },
  {
    title: "Sutra Yoga Studios",
    url: "https://www.sutrayogastudios.com/",
    image: "/projects/sutra.webp",
    mobileImage: "/projects/sutra-detail.webp",
    description:
      "Official website + full-funnel marketing for a two-studio yoga & wellness brand in Faridabad — aerial yoga, therapy, meditation and workshops.",
    category: "Website",
    tags: ["React", "Meta Ads", "Google Ads", "Local SEO"],
    year: "2025",
    role: "Website · Paid Ads · Branding",
    accent: "#16a34a",
  },
  {
    title: "Eka Katha",
    url: "https://www.ekakatha.in/",
    image: "/projects/ekakatha.webp",
    mobileImage: "/projects/ekakatha-detail.webp",
    description:
      "Storytelling-led product site for a 36-card oracle deck by Shiv Kay Sanskar — four colour-coded soul phases, six reading lenses, pan-India delivery.",
    category: "E-commerce",
    tags: ["Web Design", "Product Storytelling", "E-commerce"],
    year: "2026",
    role: "Design · Dev · Launch",
    accent: "#d97706",
  },
  {
    title: "Moon Chat AI",
    url: "https://moon-chat-8j747fe80-mayank-kumar-gautams-projects.vercel.app/signup",
    image: "/projects/moonchat.webp",
    mobileImage: "/projects/moonchat-detail.webp",
    description:
      "Conversational AI that switches personalities for dynamic, personalised chats — secure real-time sessions with context awareness.",
    category: "AI App",
    tags: ["React", "Firebase", "AI APIs", "Framer Motion", "Tailwind"],
    year: "2025",
    role: "Full build",
    accent: "#3b82f6",
  },
  {
    title: "AI Hair Transplant Visualizer",
    mock: "hair",
    description:
      "Upload a photo, see a predicted hairline & density after transplant — built for clinics to convert more leads.",
    category: "AI App",
    tags: ["React", "Image AI", "APIs", "Vercel"],
    year: "2026",
    role: "Full build",
    accent: "#ec4899",
  },
  {
    title: "AI Travel Assistant",
    mock: "travel",
    description:
      "Personal travel guide that builds day-wise itineraries, transport plans and local food picks from a few inputs.",
    category: "AI App",
    tags: ["React", "AI APIs", "Framer Motion"],
    year: "2025",
    role: "Full build",
    accent: "#06b6d4",
  },
  {
    title: "AdWiser AI",
    mock: "adwiser",
    description:
      "AI tool that recommends marketing & sales strategies based on business type, goals and investment budget.",
    category: "AI App",
    tags: ["React", "HuggingFace", "Firebase"],
    year: "2024",
    role: "Full build",
    accent: "#eab308",
  },
];

/* ---------------------------------------------------------------------------
 *  📋 COPY-PASTE TEMPLATE (isko upar array me sabse pehle paste karo)
 *
 *  {
 *    title: "Project Name",
 *    url: "https://project-link.com/",
 *    description: "Ek do line me kya banaya aur kya result aaya.",
 *    category: "Website",
 *    tags: ["Next.js", "Meta Ads"],
 *    year: "2026",
 *    role: "Design · Dev",
 *  },
 * ------------------------------------------------------------------------- */
