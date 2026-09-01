import { useState, useMemo } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  ExternalLink,
  Sparkles,
  Bot,
} from "lucide-react";
import {
  generateContextualAiPrompt,
  AI_PLATFORMS,
  type IdeaPromptContext,
} from "../../utils/aiPromptBuilder";
import {
  ChatGptLogo,
  AntigravityLogo,
  ClaudeLogo,
  KiroLogo,
} from "./AiPlatformLogos";

interface AiLaunchpadSectionProps {
  idea: {
    title: string;
    problem: string;
    solution: string;
    impact?: string;
    difficulty?: string;
    suggestedTechStack?: string;
    category?: { name: string } | string;
    tags?: Array<{ name: string }> | string[];
  };
}

export default function AiLaunchpadSection({ idea }: AiLaunchpadSectionProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const ideaContext: IdeaPromptContext = useMemo(() => {
    const categoryName = typeof idea.category === "object" ? idea.category?.name : idea.category;
    const tagNames = Array.isArray(idea.tags)
      ? idea.tags.map((t) => (typeof t === "object" ? t.name : t))
      : [];

    return {
      title: idea.title,
      problem: idea.problem,
      solution: idea.solution,
      impact: idea.impact,
      difficulty: idea.difficulty,
      suggestedTechStack: idea.suggestedTechStack,
      category: categoryName,
      tags: tagNames,
    };
  }, [idea]);

  const fullPrompt = useMemo(() => {
    return generateContextualAiPrompt(ideaContext);
  }, [ideaContext]);

  const handleCopyPrompt = async (platformName?: string) => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedStatus(platformName ? `Prompt copied for ${platformName}!` : "Prompt copied to clipboard!");
      setTimeout(() => setCopiedStatus(null), 3000);
    } catch {
      setCopiedStatus("Failed to copy");
    }
  };

  const handleLaunchPlatform = async (platformName: string, url: string) => {
    await handleCopyPrompt(platformName);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 150);
  };

  const renderPlatformLogo = (id: string) => {
    switch (id) {
      case "chatgpt":
        return <ChatGptLogo className="size-5 text-emerald-500 dark:text-emerald-400" />;
      case "antigravity":
        return <AntigravityLogo className="size-5" />;
      case "claude":
        return <ClaudeLogo className="size-5" />;
      case "kiro":
        return <KiroLogo className="size-5" />;
      default:
        return <Bot className="size-5 text-violet-500" />;
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none sm:p-8 transition-colors duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Sparkles size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Launch with AI Architects
              </h2>
              <span className="rounded-full bg-violet-50 dark:bg-violet-500/15 border border-violet-200 dark:border-violet-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300">
                1-Click Builder
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Directly scaffold this idea into production architecture, schema & code
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopyPrompt()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
        >
          <Copy size={13} /> Copy Contextual Prompt
        </button>
      </div>

      {copiedStatus && (
        <div className="mb-5 animate-reveal-up flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Check size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{copiedStatus} Ready to paste into the AI chat.</span>
          </div>
        </div>
      )}

      {/* Grid of 4 Platforms */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {AI_PLATFORMS.map((platform) => {
          const targetUrl = platform.getUrl(fullPrompt);

          return (
            <div
              key={platform.id}
              className="group rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:border-violet-200 dark:hover:border-violet-500/30 p-4 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-9 place-items-center rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-xs">
                      {renderPlatformLogo(platform.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {platform.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {platform.badge}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                  {platform.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => handleLaunchPlatform(platform.name, targetUrl)}
                  className="flex-1 inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white px-3 text-xs font-semibold shadow-xs transition"
                >
                  <span>Launch in {platform.name.split("/")[0].trim()}</span>
                  <ExternalLink size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(platform.name)}
                  title="Copy Prompt"
                  className="grid size-8 place-items-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Prompt Preview */}
      <div className="mt-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-white/[0.01] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPromptPreview(!showPromptPreview)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <div className="flex items-center gap-2">
            <Code2 size={14} className="text-violet-500" />
            <span>View Contextual Prompt Details</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>{showPromptPreview ? "Hide" : "Show"}</span>
            {showPromptPreview ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        </button>

        {showPromptPreview && (
          <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-100/50 dark:bg-black/30">
            <pre className="max-h-48 overflow-y-auto rounded-xl bg-white dark:bg-black/50 p-3 text-[11px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap select-all border border-slate-200 dark:border-white/5">
              {fullPrompt}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
