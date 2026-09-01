import { useState, useMemo } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
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
      setCopiedStatus(platformName ? `Copied for ${platformName}!` : "Copied!");
      setTimeout(() => setCopiedStatus(null), 2000);
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
        return <ChatGptLogo className="size-4 text-emerald-500 dark:text-emerald-400" />;
      case "antigravity":
        return <AntigravityLogo className="size-4" />;
      case "claude":
        return <ClaudeLogo className="size-4" />;
      case "kiro":
        return <KiroLogo className="size-4" />;
      default:
        return <Bot className="size-4 text-violet-500" />;
    }
  };

  return (
    <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Build with AI</h3>
        </div>
        <button
          type="button"
          onClick={() => handleCopyPrompt()}
          className="group relative flex size-7 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition"
          title="Copy Contextual Prompt"
        >
          {copiedStatus && copiedStatus === "Copied!" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {AI_PLATFORMS.map((platform) => {
          const targetUrl = platform.getUrl(fullPrompt);
          return (
            <button
              key={platform.id}
              onClick={() => handleLaunchPlatform(platform.name, targetUrl)}
              title={`Launch in ${platform.name}`}
              className="group grid size-12 place-items-center rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] transition hover:border-violet-200 hover:bg-violet-50/50 dark:hover:border-violet-500/30 dark:hover:bg-violet-500/10 shadow-sm hover:shadow"
            >
              <div className="transition-transform group-hover:scale-110">
                {renderPlatformLogo(platform.id)}
              </div>
            </button>
          );
        })}
      </div>

      {copiedStatus && copiedStatus !== "Copied!" && (
        <p className="mt-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {copiedStatus}
        </p>
      )}

      {/* Expandable Prompt Preview */}
      <div className="mt-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPromptPreview(!showPromptPreview)}
          className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
        >
          <div className="flex items-center gap-1.5">
            <Code2 size={12} />
            <span>View Prompt Source</span>
          </div>
          {showPromptPreview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showPromptPreview && (
          <div className="border-t border-slate-100 dark:border-white/5 p-2">
            <pre className="max-h-32 overflow-y-auto rounded-lg bg-white dark:bg-black/20 p-2 text-[9px] font-mono text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap border border-slate-200 dark:border-white/5">
              {fullPrompt}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
