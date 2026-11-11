/* ============================================================================
 *  📈 MARKETING CASE STUDIES — Google Ads & Meta Ads
 *  Naya campaign add karna ho toh neeche array me ek block copy-paste karo.
 *  Screenshot ko /public/ads/ me daalo aur `image` me path likho.
 * ========================================================================== */

export type GoogleCase = {
  client: string;
  about: string;
  type: string; // Search · Leads, App installs ...
  image: string;
  setup: { label: string; value: string }[];
  /** "Last 30 days" & "All time" — dono me se jo ho woh daalo */
  periods: { label: string; metrics: { label: string; value: string }[] }[];
  highlight: { value: string; label: string };
};

export const googleCases: GoogleCase[] = [
  {
    client: "Kredit24",
    about: "Loan service provider targeting Germany & Switzerland — German-language search campaigns.",
    type: "Search · Lead conversions",
    image: "/ads/google-kredit24.webp",
    setup: [
      { label: "Location", value: "Germany & Switzerland" },
      { label: "Language", value: "German" },
      { label: "Budget", value: "₹17k / day" },
      { label: "Bid strategy", value: "Maximize Conversions" },
      { label: "Campaigns", value: "2" },
    ],
    periods: [
      {
        label: "Last 30 days",
        metrics: [
          { label: "Clicks", value: "2,103" },
          { label: "Impressions", value: "16,384" },
          { label: "CTR", value: "12.84%" },
          { label: "Conversions", value: "695" },
          { label: "Conv. rate", value: "33.08%" },
          { label: "Cost / conv.", value: "₹400.62" },
        ],
      },
      {
        label: "All time",
        metrics: [
          { label: "Clicks", value: "2,762" },
          { label: "Impressions", value: "22,735" },
          { label: "CTR", value: "12.15%" },
          { label: "Conversions", value: "827" },
          { label: "Conv. rate", value: "29.94%" },
          { label: "Spend", value: "₹4,10,221" },
        ],
      },
    ],
    highlight: { value: "33%", label: "conversion rate" },
  },
  {
    client: "Phone Agent 007",
    about: "Android child-monitoring & employee-tracking app — Target CPA search campaign across major Indian cities.",
    type: "Search · Target CPA",
    image: "/ads/google-phoneagent.webp",
    setup: [
      { label: "Location", value: "Major cities of India" },
      { label: "Language", value: "English" },
      { label: "Budget", value: "₹1,700 / day" },
      { label: "Bid strategy", value: "Target CPA" },
      { label: "Timing", value: "9 AM – 3 AM" },
    ],
    periods: [
      {
        label: "Last 30 days",
        metrics: [
          { label: "Clicks", value: "4,856" },
          { label: "Impressions", value: "19,710" },
          { label: "CTR", value: "24.64%" },
          { label: "Avg. CPC", value: "₹7.90" },
          { label: "Conversions", value: "479" },
          { label: "Cost / conv.", value: "₹80.09" },
        ],
      },
      {
        label: "All time",
        metrics: [
          { label: "Clicks", value: "8,207" },
          { label: "Impressions", value: "33,353" },
          { label: "CTR", value: "24.61%" },
          { label: "Avg. CPC", value: "₹8.66" },
          { label: "Conversions", value: "602" },
          { label: "Spend", value: "₹71,109" },
        ],
      },
    ],
    highlight: { value: "24.6%", label: "CTR" },
  },
  {
    client: "Escale Solutions",
    about: "Web & app development company in Noida — Delhi-NCR lead generation on Target CPA.",
    type: "Search · Lead gen",
    image: "/ads/google-escale.webp",
    setup: [
      { label: "Location", value: "Delhi NCR" },
      { label: "Language", value: "English" },
      { label: "Budget", value: "₹2,400 / day" },
      { label: "Bid strategy", value: "Max. Conversions (tCPA)" },
      { label: "Timing", value: "8 AM – 12 AM, Mon–Fri" },
    ],
    periods: [
      {
        label: "Last 30 days",
        metrics: [
          { label: "Clicks", value: "458" },
          { label: "Impressions", value: "4,716" },
          { label: "CTR", value: "9.71%" },
          { label: "Conversions", value: "52" },
          { label: "Conv. rate", value: "11.35%" },
          { label: "Cost / conv.", value: "₹436.20" },
        ],
      },
      {
        label: "All time",
        metrics: [
          { label: "Clicks", value: "7,107" },
          { label: "Impressions", value: "85,732" },
          { label: "CTR", value: "8.29%" },
          { label: "Conversions", value: "602" },
          { label: "Avg. CPC", value: "₹38.24" },
          { label: "Spend", value: "₹2,71,759" },
        ],
      },
    ],
    highlight: { value: "602", label: "leads" },
  },
  {
    client: "Financial Calculator App",
    about: "SIP & FD calculator app — Google App campaign optimised for installs.",
    type: "App campaign · Installs",
    image: "/ads/google-fincalc.webp",
    setup: [
      { label: "Goal", value: "App installs" },
      { label: "Ad group", value: "SIP & FD Calculator" },
    ],
    periods: [
      {
        label: "Results",
        metrics: [
          { label: "Installs", value: "13.3K" },
          { label: "Cost / install", value: "₹1.04" },
          { label: "Impressions", value: "591K" },
          { label: "Spend", value: "₹13.8K" },
        ],
      },
    ],
    highlight: { value: "₹1.04", label: "per install" },
  },
  {
    client: "Soft Radix",
    about: "IT services company — call-lead & SEO-service campaigns with 88–97% optimisation scores.",
    type: "Search · Calls & leads",
    image: "/ads/google-softradix.webp",
    setup: [
      { label: "Campaigns", value: "Call leads · SEO service" },
      { label: "Opt. score", value: "88.1% / 97.6%" },
    ],
    periods: [
      {
        label: "Results",
        metrics: [
          { label: "Clicks", value: "554" },
          { label: "Avg. CPC", value: "₹4.27" },
          { label: "Impressions", value: "20.8K" },
          { label: "Spend", value: "₹2.36K" },
        ],
      },
    ],
    highlight: { value: "₹4.27", label: "avg. CPC" },
  },
];

export type MetaCase = {
  client: string;
  about: string;
  image: string;
  /** logos shown on the card (e.g. client + government) */
  logos?: string[];
  /** "contain" for very wide/odd screenshots */
  fit?: "cover" | "contain";
  spent: string;
  leads: string;
  reach: string;
  impressions: string;
  cpr: string;
  cprLabel?: string;
  featured?: boolean;
};

export const metaCases: MetaCase[] = [
  {
    client: "Real Estate — 14+ projects",
    about: "Commercial & residential lead-gen across Delhi / NCR, running 14+ project campaigns in parallel.",
    image: "/ads/meta-realestate.webp",
    spent: "₹1,50,053",
    leads: "4,912",
    reach: "1,07,073",
    impressions: "23,79,686",
    cpr: "₹30.55",
    featured: true,
  },
  {
    client: "HPDA × Govt. of Uttar Pradesh",
    about: "Hapur Pilkhuwa Development Authority (UP Govt.) industrial-plot scheme — a lead-form campaign plus a 15 lakh-reach awareness campaign.",
    image: "/ads/meta-hpda.webp",
    logos: ["/ads/hpda-logo.png", "/ads/up-govt-logo.png"],
    fit: "contain",
    spent: "₹52,043 + ₹5,100",
    leads: "506+",
    reach: "64,482 + 15,07,260",
    impressions: "2,91,631 + 27,36,245",
    cpr: "₹102.85",
    cprLabel: "per lead · ₹3.38 / 1K reach",
    featured: true,
  },
  {
    client: "ShikshaMitra — MBBS in Russia",
    about: "Student lead-gen for an overseas medical-education consultancy.",
    image: "/ads/meta-shikshamitra.webp",
    spent: "₹25,622",
    leads: "460",
    reach: "95,328",
    impressions: "1,53,352",
    cpr: "₹55.70",
  },
  {
    client: "Your Home Tutor",
    about: "Home-tuition service — parent leads through Facebook lead forms.",
    image: "/ads/meta-hometutor.webp",
    spent: "₹15,930",
    leads: "138",
    reach: "38,632",
    impressions: "64,537",
    cpr: "₹115.43",
  },
  {
    client: "Propvision — Anthurium Golden I",
    about: "Premium real-estate project — high-intent, high-ticket buyer leads.",
    image: "/ads/meta-shikshamitra.webp",
    spent: "₹1,778",
    leads: "4",
    reach: "4,435",
    impressions: "5,757",
    cpr: "₹444.44",
  },
];

export const marketingKpis = [
  { value: 25, prefix: "₹", suffix: " Cr", label: "Revenue driven in Dec 2025 (Keymantra)" },
  { value: 6000, suffix: "+", label: "Meta leads generated" },
  { value: 13, suffix: ".3K", label: "App installs at ₹1.04 each" },
  { value: 10, prefix: "₹", suffix: "L+", label: "Ad spend managed (shown here)" },
];

export const marketingToolkit = [
  "Meta Ads (FB · IG · WhatsApp)",
  "Google Search",
  "Google App Campaigns",
  "Performance Max",
  "YouTube Ads",
  "LinkedIn Ads",
  "Lead Forms & CRM",
  "Target CPA / Max Conv.",
  "Retargeting",
  "SEO",
  "Social Media",
  "Lead Generation",
];
