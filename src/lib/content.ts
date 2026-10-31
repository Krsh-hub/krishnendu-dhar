export const profile = {
  name: "Krishnendu Dhar",
  first: "KRISHNENDU",
  last: "DHAR",
  role: "Founder & Builder",
  location: "Kolkata, IN",
  email: "krishnendudhar10@curaapets.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Krsh-hub" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/krishnendu-dhar-b2a5562b2" },
    { label: "Instagram", href: "https://www.instagram.com/thekr1shh" },
    { label: "X / Twitter", href: "https://x.com/zeuskd_18" },
  ],
  phrases: [
    "Building ideas that refuse to stay small.",
    "Startup mind. Creative soul.",
    "Pressure creates clarity.",
    "Obsessed with impact.",
    "Still building.",
  ],
};

export type Project = {
  title: string;
  kicker: string;
  year: string;
  blurb: string;
  tags: string[];
  live?: string;
  repo?: string;
  bg: string;
  fg: string;
  motif: "rings" | "grid" | "wave" | "orbit" | "bars";
};

export const featured: Project[] = [
  {
    title: "CURAA",
    kicker: "Startup · Pet-tech · Hardware + AI",
    year: "2024 —",
    blurb:
      "A smart collar for pets. Wearable sensors stream data into an AI that learns each pet's personal health baseline, flags anomalies early, and turns them into insights for pet parents and vets.",
    tags: ["Next.js", "TypeScript", "IoT", "AI analytics"],
    live: "https://curaasmartcollar.vercel.app",
    repo: "https://github.com/Krsh-hub/kinetix",
    bg: "#0B6B22",
    fg: "#ECE9E2",
    motif: "rings",
  },
  {
    title: "NexOps",
    kicker: "AI-native SaaS · Ops & Finance",
    year: "2026",
    blurb:
      "An AI-native operations platform for small and mid-sized businesses. Inventory, finance and day-to-day ops in one place, with AI built in from day one.",
    tags: ["Next.js 15", "Prisma", "Supabase", "Postgres"],
    live: "https://nex-ops-phi.vercel.app",
    repo: "https://github.com/Krsh-hub/NexOps",
    bg: "#D9F45A",
    fg: "#0D0D0D",
    motif: "grid",
  },
  {
    title: "GDArena",
    kicker: "Voice AI · Multi-agent",
    year: "2026",
    blurb:
      "Real-time, voice-first group discussion practice. Five AI agents with distinct personas challenge and support you, then score you on clarity, confidence, vocabulary, listening, leadership and logic.",
    tags: ["Python", "STT / TTS", "Multi-agent", "LLMs"],
    repo: "https://github.com/Krsh-hub/GDArena",
    bg: "#5B4BFF",
    fg: "#F4F2FF",
    motif: "wave",
  },
  {
    title: "LitMentor",
    kicker: "EdTech · AI tutor",
    year: "2026",
    blurb:
      "An AI tutor for English Literature students. Poem, prose and drama analysis, literary devices, themes, author context and essay guidance, powered by Claude.",
    tags: ["JavaScript", "Claude API", "Chat UI"],
    live: "https://litbot-gray.vercel.app",
    repo: "https://github.com/Krsh-hub/Litbot",
    bg: "#F2E3C6",
    fg: "#1A1410",
    motif: "orbit",
  },
  {
    title: "RIS",
    kicker: "Retention Intelligence System",
    year: "2026",
    blurb:
      "AI-powered customer retention and reactivation for local businesses. It finds who's drifting away and helps bring them back before they're gone.",
    tags: ["TypeScript", "Supabase", "AI"],
    repo: "https://github.com/Krsh-hub/RIS",
    bg: "#FF4A1C",
    fg: "#0D0D0D",
    motif: "bars",
  },
];

export type ArchiveItem = {
  title: string;
  kind: string;
  stack: string;
  year: string;
  note: string;
  href?: string;
  secret?: boolean;
};

export const archive: ArchiveItem[] = [
  {
    title: "[REDACTED]",
    kind: "EdTech venture",
    stack: "Stealth mode",
    year: "Soon",
    note: "Rethinking how the next generation experiences learning. That's all I can say.",
    secret: true,
  },
  {
    title: "AITian News",
    kind: "AI news aggregator",
    stack: "Next.js · Supabase",
    year: "2026",
    note: "Real-time AI news from trusted sources, in a fast, glassy, dark-mode UI.",
    href: "https://ai-tians-news.vercel.app",
  },
  {
    title: "Ledger on WhatsApp",
    kind: "AI accounting agent",
    stack: "Python",
    year: "2026",
    note: "A conversational bookkeeping assistant for Indian small businesses that lives entirely inside WhatsApp.",
    href: "https://github.com/Krsh-hub/bookkeeping_chatbot",
  },
  {
    title: "CardioSenseAI",
    kind: "Health × AI",
    stack: "React · Vite",
    year: "2026",
    note: "An AI experiment in cardiac health.",
    href: "https://cardiosenseai-six.vercel.app",
  },
  {
    title: "LinkedIn Analyzer",
    kind: "Privacy-first utility",
    stack: "Python",
    year: "2026",
    note: "Parses your LinkedIn export locally. Classifies seniority, dedupes contacts and builds Excel reports.",
    href: "https://github.com/Krsh-hub/LinkedIn-Filter",
  },
  {
    title: "DocForge",
    kind: "Dev tool",
    stack: "TypeScript",
    year: "2026",
    note: "A document-generation side project.",
    href: "https://github.com/Krsh-hub/DocForge",
  },
  {
    title: "ConversAI",
    kind: "Conversational AI",
    stack: "Python",
    year: "2026",
    note: "Experiments in conversational agents.",
    href: "https://github.com/Krsh-hub/ConversAI",
  },
  {
    title: "FundZ",
    kind: "Marketplace",
    stack: "JavaScript",
    year: "2026",
    note: "A platform connecting investors with entrepreneurs.",
    href: "https://github.com/Krsh-hub/FundZ",
  },
  {
    title: "Cura",
    kind: "Where it started",
    stack: "TypeScript",
    year: "2024",
    note: "An online platform for furry friends. The seed that became CURAA.",
    href: "https://github.com/Krsh-hub/Cura",
  },
];
