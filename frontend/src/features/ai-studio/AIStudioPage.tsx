import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Blocks,
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Download,
  FileText,
  Gauge,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  MessageCircle,
  Presentation,
  Rocket,
  SearchCheck,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import ideaService from "../../services/ideaService";
import projectService from "../../services/projectService";
import { useAuth } from "../../hooks/useAuth";
import type { Idea } from "../../types/idea.types";
import { DEMO_IDEAS_DATABASE } from "../../data/demoIdeasDatabase";

type WorkbenchIdea = Pick<
  Idea,
  | "id"
  | "_id"
  | "title"
  | "problem"
  | "solution"
  | "impact"
  | "difficulty"
  | "suggestedTechStack"
  | "techStack"
  | "estimatedTime"
  | "roadmap"
  | "status"
  | "voteCount"
  | "commentCount"
  | "category"
  | "tags"
>;

type ActionId =
  | "improve"
  | "mvp"
  | "validation"
  | "prd"
  | "pitch"
  | "risks"
  | "tech"
  | "launch"
  | "readme"
  | "issues"
  | "feedback";

type StudioAction = {
  id: ActionId;
  label: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

type ArtifactSection = {
  title: string;
  body: string | string[];
};

type Artifact = {
  title: string;
  eyebrow: string;
  summary: string;
  sections: ArtifactSection[];
};

const demoIdeas: WorkbenchIdea[] = DEMO_IDEAS_DATABASE.slice(2, 8).map((idea, index) => ({
  id: idea.id,
  _id: idea.id,
  title: idea.title,
  problem: idea.problem,
  solution: idea.solution,
  impact: `Could improve productivity for teams working in ${idea.focusArea.toLowerCase()} by making the workflow faster, clearer, and easier to repeat.`,
  difficulty: idea.difficulty,
  suggestedTechStack: idea.tags.includes("AI & Machine Learning")
    ? "React, FastAPI, PostgreSQL, vector search, OpenAI or Gemini"
    : "React, Node.js, PostgreSQL, Redis",
  techStack: idea.tags.slice(0, 4),
  estimatedTime: idea.difficulty === "Advanced" ? "8 - 12 weeks" : idea.difficulty === "Intermediate" ? "4 - 6 weeks" : "2 - 3 weeks",
  roadmap: [
    { phase: "Discovery", tasks: ["Interview target users", "Map existing workflow"] },
    { phase: "MVP", tasks: ["Build core workflow", "Ship first measurable outcome"] },
    { phase: "Launch", tasks: ["Invite early adopters", "Track activation and retention"] },
  ],
  status: "published",
  voteCount: 12 + index * 7,
  commentCount: 3 + index * 2,
  category: { id: idea.category, _id: idea.category, name: idea.category, slug: idea.category.toLowerCase(), icon: "" },
  tags: idea.tags.map((tag) => ({ id: tag, _id: tag, name: tag, slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-") })),
}));

const demoCanvasNotes: Record<string, string> = {
  Problem: "Knowledge workers lose momentum when raw ideas, feedback, MVP planning, and launch material live in separate tools.",
  Customer: "Solo builders, hackathon teams, and early-stage founders who need to move from vague concept to testable artifact quickly.",
  Metrics: "A useful first signal is how many ideas reach a complete validation plan within one session.",
};

const canvasBlocks = ["Problem", "Customer", "Solution", "Revenue", "Channels", "Costs", "Metrics", "Advantage", "Growth"];

const actions: StudioAction[] = [
  { id: "improve", label: "Improve idea", description: "Sharper problem, solution, audience, and value.", icon: WandSparkles },
  { id: "mvp", label: "MVP plan", description: "Smallest useful product and build sequence.", icon: Rocket },
  { id: "validation", label: "Validation kit", description: "Interview questions, survey copy, and metrics.", icon: SearchCheck },
  { id: "prd", label: "Generate PRD", description: "Product requirements for handoff or planning.", icon: FileText },
  { id: "pitch", label: "Pitch brief", description: "Clear narrative for community or stakeholders.", icon: Presentation },
  { id: "risks", label: "Risks", description: "Assumptions, failure modes, and de-risking tests.", icon: Target },
  { id: "tech", label: "Tech stack", description: "Architecture, services, and implementation notes.", icon: Code2 },
  { id: "launch", label: "Launch checklist", description: "Ship-readiness tasks across product and growth.", icon: ClipboardCheck },
  { id: "readme", label: "README starter", description: "Project README users can export.", icon: Blocks },
  { id: "issues", label: "GitHub issues", description: "Starter implementation backlog.", icon: ListChecks },
  { id: "feedback", label: "Feedback summary", description: "Simulated summary from votes and comments.", icon: MessageCircle },
];

function getIdeaId(idea: WorkbenchIdea) {
  return idea.id || idea._id;
}

function cleanText(value?: string) {
  return value?.trim() || "";
}

function fallbackAudience(idea: WorkbenchIdea, canvasNotes: Record<string, string>) {
  return cleanText(canvasNotes.Customer) || `${idea.category?.name || "product"} teams that feel this problem often enough to seek a faster workflow.`;
}

function techStackText(idea: WorkbenchIdea) {
  if (idea.techStack?.length) return idea.techStack.join(", ");
  return idea.suggestedTechStack || "React, Node.js, PostgreSQL, background jobs, and a model provider behind the backend API";
}

function makeBullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function artifactToMarkdown(artifact: Artifact) {
  const lines = [`# ${artifact.title}`, "", artifact.summary, ""];
  artifact.sections.forEach((section) => {
    lines.push(`## ${section.title}`);
    lines.push(Array.isArray(section.body) ? makeBullets(section.body) : section.body);
    lines.push("");
  });
  return lines.join("\n");
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildArtifact(action: ActionId, idea: WorkbenchIdea, canvasNotes: Record<string, string>): Artifact {
  const audience = fallbackAudience(idea, canvasNotes);
  const problem = cleanText(idea.problem) || "The problem needs a clearer statement before the team can validate it.";
  const solution = cleanText(idea.solution) || "The solution needs a focused MVP path before the team can build it.";
  const stack = techStackText(idea);

  switch (action) {
    case "improve":
      return {
        eyebrow: "Idea refinement",
        title: `Sharper version of ${idea.title}`,
        summary: "A tighter concept brief that makes the idea easier to discuss, validate, and build.",
        sections: [
          { title: "Refined Problem", body: `${audience} struggle because ${problem.charAt(0).toLowerCase()}${problem.slice(1)}` },
          { title: "Refined Solution", body: `${solution} The first version should focus on one repeatable moment where users can see value in minutes, not weeks.` },
          { title: "Positioning", body: `${idea.title} should be framed as a practical workflow accelerator, not just another idea repository or AI chat.` },
          { title: "Next Move", body: ["Pick one target user group", "Run five short interviews", "Build the smallest workflow that produces a useful output"] },
        ],
      };
    case "mvp":
      return {
        eyebrow: "Build planner",
        title: `${idea.title} MVP plan`,
        summary: "A scoped path from prototype to first external users.",
        sections: [
          { title: "MVP Promise", body: `Help ${audience} complete the core job without switching between capture, planning, and validation tools.` },
          { title: "Week 1", body: ["Define primary user and job", "Create data model and core screens", "Add one high-value generated output"] },
          { title: "Week 2", body: ["Ship editable artifact output", "Add export to markdown", "Track completion and user feedback"] },
          { title: "Not In MVP", body: ["Team billing", "Complex automation chains", "Custom model fine-tuning", "Public marketplace features"] },
        ],
      };
    case "validation":
      return {
        eyebrow: "Validation kit",
        title: `${idea.title} validation kit`,
        summary: "A practical research pack for learning whether the problem is real before overbuilding.",
        sections: [
          { title: "Interview Questions", body: ["When did this problem last happen?", "What did you use to work around it?", "How much time or money did it cost?", "Who else is involved in this workflow?", "What would make you switch from your current approach?"] },
          { title: "Survey Copy", body: `We are exploring ${idea.title}. If you regularly deal with this problem, we would like to understand your current workflow, pain level, and what a useful first version would need to do.` },
          { title: "Success Metrics", body: ["5 qualified conversations", "3 users ask to try a prototype", "At least 1 current workaround has clear cost", "Users can explain the value in their own words"] },
          { title: "Landing Page Test", body: `Headline: ${idea.title} turns scattered work into a clear next action for ${audience}.` },
        ],
      };
    case "prd":
      return {
        eyebrow: "Product artifact",
        title: `${idea.title} PRD`,
        summary: "A compact product requirements document for execution planning.",
        sections: [
          { title: "Objective", body: `Deliver a focused product that solves this problem: ${problem}` },
          { title: "Target Users", body: audience },
          { title: "Core Requirements", body: ["Capture the core input clearly", "Generate a structured plan or artifact", "Allow editing before export", "Persist progress for signed-in users"] },
          { title: "Acceptance Criteria", body: ["A user can complete the primary flow in one session", "Generated output is editable and exportable", "The product records enough context to resume later"] },
          { title: "Open Questions", body: ["Which user segment has the highest urgency?", "Which output is worth paying for first?", "What data must never leave the workspace?"] },
        ],
      };
    case "pitch":
      return {
        eyebrow: "Pitch brief",
        title: `${idea.title} pitch`,
        summary: "A concise narrative for sharing the idea with collaborators, early users, or a community.",
        sections: [
          { title: "Hook", body: `${audience} waste time turning scattered inputs into useful decisions.` },
          { title: "Problem", body: problem },
          { title: "Solution", body: solution },
          { title: "Why Now", body: "AI-assisted workflows are becoming normal, but users still need productized outputs that connect to real planning and execution." },
          { title: "Ask", body: "Talk to five potential users, recruit two design partners, and validate the highest-value output before expanding scope." },
        ],
      };
    case "risks":
      return {
        eyebrow: "Risk scanner",
        title: `${idea.title} risks and assumptions`,
        summary: "The assumptions most likely to decide whether this idea is worth building.",
        sections: [
          { title: "Critical Assumptions", body: ["The target user feels this problem frequently", "The generated output is trusted enough to act on", "The workflow saves meaningful time compared with current tools"] },
          { title: "Product Risks", body: ["Too many features before the core job is proven", "AI output feels generic", "Users need integrations before they see value"] },
          { title: "De-risking Tests", body: ["Concierge the output manually for 3 users", "Compare time-to-plan against their current process", "Ask users to edit and use the artifact in a real task"] },
        ],
      };
    case "tech":
      return {
        eyebrow: "Technical plan",
        title: `${idea.title} stack and architecture`,
        summary: "A pragmatic implementation path for the first useful version.",
        sections: [
          { title: "Recommended Stack", body: stack },
          { title: "Core Services", body: ["Authentication and workspace data", "Idea and artifact generation API", "Background enrichment for roadmap and metadata", "Markdown export"] },
          { title: "AI Integration", body: "Put model calls behind the backend, keep provider keys server-side, and return structured JSON so the UI can render reliable artifacts." },
          { title: "Data To Store", body: ["Selected idea", "Generated artifact type", "Editable artifact content", "Canvas notes used as context"] },
        ],
      };
    case "launch":
      return {
        eyebrow: "Launch checklist",
        title: `${idea.title} launch checklist`,
        summary: "A short release checklist for getting the idea in front of real users.",
        sections: [
          { title: "Product", body: ["Complete primary workflow", "Add empty, loading, and error states", "Export generated artifacts", "Capture feedback after use"] },
          { title: "Growth", body: ["Write one community post", "Invite 10 target users", "Prepare a demo script", "Create before-and-after examples"] },
          { title: "Measurement", body: ["Activation rate", "Artifact exports", "Return visits", "Qualitative feedback themes"] },
        ],
      };
    case "readme":
      return {
        eyebrow: "Developer artifact",
        title: `${idea.title} README starter`,
        summary: "A README outline that can become the project homepage for builders.",
        sections: [
          { title: "Overview", body: `${idea.title} helps ${audience} solve a repeated workflow problem with a focused digital product.` },
          { title: "Problem", body: problem },
          { title: "Solution", body: solution },
          { title: "Tech Stack", body: stack },
          { title: "Getting Started", body: ["Install dependencies", "Configure environment variables", "Run backend and frontend", "Create the first workspace record"] },
        ],
      };
    case "issues":
      return {
        eyebrow: "Execution backlog",
        title: `${idea.title} starter GitHub issues`,
        summary: "A ready-to-copy backlog for turning the idea into implementation work.",
        sections: [
          { title: "Issue 1", body: "Create data model for saved artifacts and selected idea context." },
          { title: "Issue 2", body: "Build idea selector and readiness scoring UI." },
          { title: "Issue 3", body: "Add deterministic artifact generation with markdown export." },
          { title: "Issue 4", body: "Add backend AI endpoint returning structured JSON artifacts." },
          { title: "Issue 5", body: "Track user feedback and summarize comments on each idea." },
        ],
      };
    case "feedback":
      return {
        eyebrow: "Feedback summarizer",
        title: `${idea.title} feedback summary`,
        summary: "A simulated synthesis using available vote and comment counts until full comment ingestion is wired into Studio.",
        sections: [
          { title: "Positive Signals", body: [`${idea.voteCount || 0} votes suggest the idea has visible appeal`, "The problem is understandable from the current description", "The solution can be scoped into a first workflow"] },
          { title: "Likely Concerns", body: ["Users may ask how it differs from existing tools", "The first version needs proof that AI output is specific enough", "A narrow customer segment should be chosen before launch"] },
          { title: "Suggested Pivot", body: `Lead with the fastest measurable outcome for ${audience}, then expand after usage data confirms the repeated workflow.` },
        ],
      };
  }
}

function getReadiness(idea: WorkbenchIdea, canvasNotes: Record<string, string>) {
  const checks = [
    { label: "Problem clarity", passed: cleanText(idea.problem).length >= 80, detail: "Problem explains the repeated friction." },
    { label: "Solution clarity", passed: cleanText(idea.solution).length >= 80, detail: "Solution describes a concrete workflow." },
    { label: "Target user", passed: Boolean(cleanText(canvasNotes.Customer)), detail: "Canvas names a focused early adopter." },
    { label: "Impact", passed: Boolean(cleanText(idea.impact)), detail: "Value is explicit enough to pitch." },
    { label: "Tags and category", passed: Boolean(idea.category?.name && idea.tags?.length), detail: "Discovery metadata is present." },
    { label: "Build plan", passed: Boolean(idea.roadmap?.length || idea.estimatedTime), detail: "Execution path is defined." },
    { label: "Community signal", passed: (idea.voteCount || 0) + (idea.commentCount || 0) > 5, detail: "Has feedback or simulated demo signal." },
  ];
  const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
  return { score, checks };
}

function canvasSuggestion(block: string, idea: WorkbenchIdea, canvasNotes: Record<string, string>) {
  const current = cleanText(canvasNotes[block]);
  if (current) return current;

  const map: Record<string, string> = {
    Problem: idea.problem,
    Customer: fallbackAudience(idea, canvasNotes),
    Solution: idea.solution,
    Revenue: "Start with a lightweight subscription or per-workspace plan once users repeatedly export or share generated artifacts.",
    Channels: "Reach builders in founder communities, hackathon groups, product forums, and small-team productivity spaces.",
    Costs: "MVP costs are mostly engineering time, model usage, hosting, onboarding interviews, and a small budget for user research.",
    Metrics: "Track completed artifacts, exported plans, repeat sessions, and the number of ideas that move from draft to published.",
    Advantage: "The advantage can come from connected idea history, reusable planning context, and workflow-specific outputs.",
    Growth: "Each exported artifact can carry a share loop that invites collaborators back into the idea workspace.",
  };

  return map[block] || "Add one concrete note that makes this part easier to test.";
}

export default function AIStudioPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<WorkbenchIdea[]>(demoIdeas);
  const [selectedIdeaId, setSelectedIdeaId] = useState(demoIdeas[0]?.id || "");
  const [canvasNotes, setCanvasNotes] = useState<Record<string, string>>(demoCanvasNotes);
  const [activeAction, setActiveAction] = useState<ActionId>("prd");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"account" | "demo">("demo");
  const [canvasSaveState, setCanvasSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    let alive = true;

    async function loadWorkspace() {
      if (!user) {
        setSource("demo");
        setIdeas(demoIdeas);
        setCanvasNotes(demoCanvasNotes);
        setSelectedIdeaId(demoIdeas[0]?.id || "");
        return;
      }

      setLoading(true);
      try {
        const [ideaResponse, canvasResponse] = await Promise.all([
          ideaService.getMyIdeas({ limit: 8 }),
          projectService.getCanvas(),
        ]);
        if (!alive) return;
        const accountIdeas = ideaResponse.data.ideas || [];
        setIdeas(accountIdeas.length ? accountIdeas : demoIdeas);
        setSelectedIdeaId(getIdeaId(accountIdeas[0] || demoIdeas[0]));
        setCanvasNotes(Object.keys(canvasResponse.data.notes || {}).length ? canvasResponse.data.notes : demoCanvasNotes);
        setSource(accountIdeas.length ? "account" : "demo");
      } catch (error) {
        if (!alive) return;
        console.error("AI Studio workspace load failed", error);
        setSource("demo");
        setIdeas(demoIdeas);
        setCanvasNotes(demoCanvasNotes);
        setSelectedIdeaId(demoIdeas[0]?.id || "");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadWorkspace();
    return () => {
      alive = false;
    };
  }, [user]);

  const selectedIdea = useMemo(() => {
    return ideas.find((idea) => getIdeaId(idea) === selectedIdeaId) || ideas[0] || demoIdeas[0];
  }, [ideas, selectedIdeaId]);

  const readiness = useMemo(() => getReadiness(selectedIdea, canvasNotes), [selectedIdea, canvasNotes]);
  const artifact = useMemo(() => buildArtifact(activeAction, selectedIdea, canvasNotes), [activeAction, selectedIdea, canvasNotes]);
  const markdown = useMemo(() => artifactToMarkdown(artifact), [artifact]);
  const topNextAction = readiness.checks.find((check) => !check.passed)?.label || "Run a validation sprint";

  async function applyCanvasSuggestion(block: string) {
    const nextNotes = { ...canvasNotes, [block]: canvasSuggestion(block, selectedIdea, canvasNotes) };
    setCanvasNotes(nextNotes);
    if (!user) return;
    setCanvasSaveState("saving");
    try {
      await projectService.saveCanvas(nextNotes);
      setCanvasSaveState("saved");
    } catch {
      setCanvasSaveState("error");
    }
  }

  function handleExport() {
    const filename = `${selectedIdea.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${activeAction}.md`;
    downloadMarkdown(filename, markdown);
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 transition-colors duration-500 sm:px-8 sm:py-10 xl:px-12">
      <main className="mx-auto max-w-[1440px]">
        <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#A16207] dark:text-[#A16207]">AI STUDIO</p>
              <span className="rounded-full border border-[#FDE047] bg-[#FEF3C7] px-2.5 py-1 text-[11px] font-semibold text-[#854D0E] dark:border-[#A16207]/25 dark:bg-[#A16207]/10 dark:text-[#CA8A04]">
                {source === "account" ? "Using your workspace" : "Demo mode"}
              </span>
            </div>
            <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Turn ideas into useful artifacts.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">
              Select an idea, check what is missing, generate planning assets, fill your canvas, and export the result.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#1C1917] dark:text-slate-300 dark:hover:bg-white/5">
              <Lightbulb size={17} /> Capture idea
            </Link>
            <button onClick={handleExport} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#A16207] px-4 text-sm font-semibold text-white shadow-lg shadow-[#A162071a] transition hover:bg-[#854D0E] dark:shadow-none">
              <Download size={17} /> Export artifact
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Idea queue</p>
                <h2 className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">Choose context</h2>
              </div>
              {loading && <LoaderCircle size={18} className="animate-spin text-[#A16207]" />}
            </div>

            <div className="mt-5 space-y-2">
              {ideas.map((idea) => {
                const id = getIdeaId(idea);
                const active = id === getIdeaId(selectedIdea);
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedIdeaId(id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-[#FDE047] bg-[#FEF3C7] text-[#854D0E] dark:border-[#A16207]/25 dark:bg-[#A16207]/10 dark:text-[#CA8A04]"
                        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-[#FDE047] hover:bg-white dark:border-white/5 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/15 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="line-clamp-2 text-sm font-semibold">{idea.title}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                      <span>{idea.category?.name || "Uncategorized"}</span>
                      <span>{idea.difficulty}</span>
                      <span>{idea.voteCount || 0} votes</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="space-y-5">
            <article className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,.3)] transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      {selectedIdea.category?.name || "Uncategorized"}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                      {selectedIdea.difficulty}
                    </span>
                    {selectedIdea.estimatedTime && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                        <CalendarDays size={12} /> {selectedIdea.estimatedTime}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">{selectedIdea.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{selectedIdea.problem}</p>
                </div>
                <div className="min-w-[150px] rounded-2xl bg-gradient-to-br from-[#A16207] to-[#EAB308] p-4 text-white">
                  <div className="flex items-center gap-2">
                    <Gauge size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Readiness</span>
                  </div>
                  <p className="mt-4 text-4xl font-bold">{readiness.score}%</p>
                  <p className="mt-1 text-xs text-white/80">Next: {topNextAction}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {readiness.checks.map((check) => (
                  <div key={check.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className={check.passed ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"} />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{check.label}</p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">{check.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Productivity actions</p>
                  <h2 className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">Generate the next useful thing</h2>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Demo outputs now, API-ready shape later.</p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {actions.map((action) => {
                  const Icon = action.icon;
                  const active = action.id === activeAction;
                  return (
                    <button
                      key={action.id}
                      onClick={() => setActiveAction(action.id)}
                      className={`min-h-[104px] rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[#FDE047] bg-[#FEF3C7] shadow-sm dark:border-[#A16207]/25 dark:bg-[#A16207]/10"
                          : "border-slate-100 bg-slate-50 hover:border-[#FDE047] hover:bg-white dark:border-white/5 dark:bg-white/[0.03] dark:hover:border-white/15 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className={`grid size-9 place-items-center rounded-xl ${active ? "bg-[#A16207] text-white" : "bg-white text-[#A16207] dark:bg-white/5 dark:text-[#CA8A04]"}`}>
                        <Icon size={17} />
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-slate-800 dark:text-slate-100">{action.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400 dark:text-slate-500">{action.description}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          </section>

          <aside className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Canvas co-pilot</p>
                <h2 className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">Fill the gaps</h2>
              </div>
              <span className="grid size-10 place-items-center rounded-2xl bg-[#FEF3C7] text-[#A16207] dark:bg-white/5">
                <Bot size={18} />
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Suggestions are generated from the selected idea and can be applied to your saved project canvas.
            </p>

            <div className="mt-5 space-y-3">
              {canvasBlocks.map((block) => {
                const filled = Boolean(cleanText(canvasNotes[block]));
                return (
                  <div key={block} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{block}</p>
                      <button
                        onClick={() => applyCanvasSuggestion(block)}
                        className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-[#A16207] transition hover:bg-[#FEF3C7] dark:hover:bg-[#A16207]/10"
                      >
                        {filled ? "Refresh" : "Apply"} <ArrowUpRight size={13} />
                      </button>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{canvasSuggestion(block, selectedIdea, canvasNotes)}</p>
                  </div>
                );
              })}
            </div>
            {canvasSaveState !== "idle" && (
              <p className={`mt-4 text-xs ${canvasSaveState === "error" ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                {canvasSaveState === "saving" ? "Saving canvas..." : canvasSaveState === "saved" ? "Canvas saved." : "Canvas could not be saved."}
              </p>
            )}
          </aside>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,.3)] transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-white/5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#A16207] dark:text-[#CA8A04]">{artifact.eyebrow}</p>
                <h2 className="font-heading mt-1 text-2xl font-bold text-slate-900 dark:text-white">{artifact.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{artifact.summary}</p>
              </div>
              <button onClick={handleExport} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#292524] dark:text-slate-300 dark:hover:bg-white/5">
                <Download size={15} /> Download
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {artifact.sections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{section.title}</h3>
                  {Array.isArray(section.body) ? (
                    <ul className="mt-3 space-y-2">
                      {section.body.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#A16207]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{section.body}</p>
                  )}
                </section>
              ))}
            </div>
          </article>

          <aside className="space-y-5">
            <article className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-[#FEF3C7] text-[#A16207] dark:bg-white/5">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">AI integration path</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Ready for a backend model provider.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                <p>Current page generates deterministic demo artifacts from idea and canvas context.</p>
                <p>To enable live AI, add a backend endpoint that accepts action, idea, and canvas context, then returns the same artifact shape rendered here.</p>
              </div>
            </article>

            <article className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-white/5 dark:bg-[#1C1917] dark:shadow-none">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Markdown preview</p>
              <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                {markdown}
              </pre>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
