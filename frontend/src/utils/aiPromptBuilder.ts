/**
 * Contextual AI Prompt Builder & AI Platform Integrations
 * --------------------------------------------------------
 * Generates tailored, rich prompts from idea metadata for
 * leading AI coding platforms (ChatGPT/Codex, Google Antigravity, Claude, Kiro).
 */

export interface IdeaPromptContext {
  title: string;
  problem: string;
  solution: string;
  impact?: string;
  category?: string;
  tags?: string[];
  difficulty?: string;
  suggestedTechStack?: string;
}

export interface AiPlatform {
  id: "chatgpt" | "antigravity" | "claude" | "kiro";
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  color: string;
  accentColor: string;
  borderColor: string;
  hoverBorderColor: string;
  bgGradient: string;
  tagColor: string;
  getUrl: (prompt: string) => string;
}

export function generateContextualAiPrompt(idea: IdeaPromptContext): string {
  const title = idea.title?.trim() || "Untitled Project";
  const problem = idea.problem?.trim() || "No problem statement specified.";
  const solution = idea.solution?.trim() || "No solution outlined.";
  const impact = idea.impact?.trim();
  const category = idea.category?.trim() || "Software Engineering / Full-Stack";
  const difficulty = idea.difficulty || "Intermediate";
  const techStack = idea.suggestedTechStack?.trim() || "Modern Full-Stack (React / Node.js / PostgreSQL / TypeScript)";
  const tags = idea.tags && idea.tags.length > 0 ? idea.tags.join(", ") : "Web Development, Full-Stack, Architecture";

  return `# 🚀 Project Blueprint & System Architecture: ${title}

You are an elite Principal Software Architect and Full-Stack Tech Lead. I am starting development on a new project titled "${title}" and need your help to build a production-grade architecture, database schema, API design, and initial boilerplate code foundation.

---

### 📋 1. Project Overview & Meta Context
- **Project Title:** ${title}
- **Domain / Category:** ${category}
- **Complexity Level:** ${difficulty}
- **Target Tech Stack:** ${techStack}
- **Relevant Tags / Concepts:** ${tags}

---

### 🚨 2. Problem Statement
${problem}

---

### 💡 3. Proposed Solution & Core Innovation
${solution}
${impact ? `\n---\n\n### 🎯 4. Target Impact & Expected Outcome\n${impact}\n` : ""}
---

### 🛠️ 5. Implementation Requirements & Goals for You

Please walk me through the complete engineering specification and write the initial starter code:

1. **System Architecture & Data Flow**
   - Provide a clean component breakdown (Frontend, Backend API, Database, Caching, and Async Workers).
   - High-level data flow diagram (Mermaid or structured ASCII).

2. **Core Database Schema & Data Models**
   - Provide exact data models (e.g. Prisma schema, PostgreSQL DDL, or TypeScript interfaces) with all necessary relationships, indexes, and constraints.

3. **REST / GraphQL API Endpoints**
   - Define essential API endpoints with request payloads and response signatures.
   - Specify authentication, authorization, and error handling mechanisms.

4. **Step-by-Step Execution Roadmap**
   - **Phase 1 (MVP - 48h):** The absolute minimal core user loop.
   - **Phase 2 (Core Features):** Collaboration, state persistence, notifications.
   - **Phase 3 (Scale & Polish):** Caching, rate limiting, analytics, and deployment guide.

5. **Production Starter Code Boilerplate**
   - Recommended project directory structure.
   - Fully runnable, well-typed code for the main business logic and core services to immediately bootstrap development.

---
Please begin with a concise executive summary of your architectural strategy, followed by the system design and the foundational starter code!`;
}

export const AI_PLATFORMS: AiPlatform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT / Codex",
    badge: "OpenAI",
    subtitle: "GPT-4o & Codex Code Agent",
    description: "Instant architectural breakdown, code generation, and step-by-step guidance.",
    color: "#10A37F",
    accentColor: "emerald",
    borderColor: "border-emerald-500/20",
    hoverBorderColor: "hover:border-emerald-500/50 hover:shadow-emerald-950/30",
    bgGradient: "from-emerald-950/25 via-emerald-900/10 to-transparent",
    tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    getUrl: (prompt: string) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "antigravity",
    name: "Google Antigravity",
    badge: "Google DeepMind",
    subtitle: "Advanced Agentic IDE & Studio",
    description: "Deep reasoning, large context codebase synthesis, and full-stack prototyping.",
    color: "#8B5CF6",
    accentColor: "violet",
    borderColor: "border-violet-500/20",
    hoverBorderColor: "hover:border-violet-500/50 hover:shadow-violet-950/30",
    bgGradient: "from-violet-950/25 via-purple-900/10 to-transparent",
    tagColor: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    getUrl: () => `https://gemini.google.com/app`,
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    badge: "Claude 3.5 / 3.7",
    subtitle: "Artifacts & Clean Architecture",
    description: "World-class code structuring, interactive UI artifacts, and system modeling.",
    color: "#D97706",
    accentColor: "amber",
    borderColor: "border-amber-500/20",
    hoverBorderColor: "hover:border-amber-500/50 hover:shadow-amber-950/30",
    bgGradient: "from-amber-950/25 via-orange-900/10 to-transparent",
    tagColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    getUrl: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  },
  {
    id: "kiro",
    name: "Kiro AI",
    badge: "Kiro Engine",
    subtitle: "Full-Context AI Codebase Builder",
    description: "Streamlined agentic execution, scaffolding, and full-project initialization.",
    color: "#06B6D4",
    accentColor: "cyan",
    borderColor: "border-cyan-500/20",
    hoverBorderColor: "hover:border-cyan-500/50 hover:shadow-cyan-950/30",
    bgGradient: "from-cyan-950/25 via-sky-900/10 to-transparent",
    tagColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    getUrl: () => `https://kiro.dev`,
  },
];
