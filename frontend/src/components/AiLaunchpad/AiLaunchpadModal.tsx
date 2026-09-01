import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  ExternalLink,
  Lightbulb,
  Sparkles,
  ArrowRight,
  X,
  Bot,
  Zap,
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

interface AiLaunchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaData: IdeaPromptContext;
  createdIdeaId: string;
}

export default function AiLaunchpadModal({
  isOpen,
  onClose,
  ideaData,
  createdIdeaId,
}: AiLaunchpadModalProps) {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const fullPrompt = useMemo(() => {
    return generateContextualAiPrompt(ideaData);
  }, [ideaData]);

  if (!isOpen) return null;

  const handleCopyPrompt = async (platformName?: string) => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedStatus(platformName ? `Copied for ${platformName}!` : "Prompt copied to clipboard!");
      setTimeout(() => setCopiedStatus(null), 3000);
    } catch {
      // Fallback
      setCopiedStatus("Failed to copy");
    }
  };

  const handleLaunchPlatform = async (platformName: string, url: string) => {
    await handleCopyPrompt(platformName);
    // Slight pause to ensure clipboard write completes, then open in new tab
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 150);
  };

  const renderPlatformLogo = (id: string) => {
    switch (id) {
      case "chatgpt":
        return <ChatGptLogo className="size-6 text-emerald-400" />;
      case "antigravity":
        return <AntigravityLogo className="size-6" />;
      case "claude":
        return <ClaudeLogo className="size-6" />;
      case "kiro":
        return <KiroLogo className="size-6" />;
      default:
        return <Bot className="size-6 text-violet-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 backdrop-blur-md px-4 py-6 sm:px-6 overflow-y-auto">
      <div className="animate-reveal-up relative w-full max-w-4xl rounded-[32px] border border-violet-500/20 bg-[#1C1917] text-white shadow-2xl shadow-purple-950/50 p-6 sm:p-8 my-auto overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-28 -right-28 size-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 size-96 rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 grid size-9 place-items-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-start gap-3 border-b border-white/10 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Check size={13} className="stroke-[3]" /> Idea Published
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300">
              <Sparkles size={13} /> AI Builder Launchpad
            </span>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Turn "{ideaData.title}" into Reality
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-2xl">
              Select an AI agent below to automatically generate full system architectures, database schemas, and production code with preloaded contextual prompts.
            </p>
          </div>
        </div>

        {/* Copy Status Notification Toast */}
        {copiedStatus && (
          <div className="my-4 animate-reveal-up flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-300 shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>{copiedStatus} Prompt has been copied to your clipboard.</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">Ready to paste</span>
          </div>
        )}

        {/* AI Platform Redirection Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap size={14} className="text-violet-400" />
              Choose Your AI Coding Assistant
            </h3>
            <button
              type="button"
              onClick={() => handleCopyPrompt()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Copy size={13} /> Copy Raw Prompt
            </button>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {AI_PLATFORMS.map((platform) => {
              const targetUrl = platform.getUrl(fullPrompt);

              return (
                <div
                  key={platform.id}
                  className={`group relative rounded-2xl border ${platform.borderColor} ${platform.hoverBorderColor} bg-gradient-to-br ${platform.bgGradient} bg-[#17131F] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 place-items-center rounded-xl bg-white/5 border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                          {renderPlatformLogo(platform.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-base font-bold text-white group-hover:text-violet-200 transition">
                              {platform.name}
                            </h4>
                          </div>
                          <p className="text-xs font-medium text-slate-400">
                            {platform.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${platform.tagColor}`}>
                        {platform.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300/90 leading-relaxed mb-4">
                      {platform.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleLaunchPlatform(platform.name, targetUrl)}
                      className="flex-1 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-3 text-xs font-semibold text-white shadow-sm transition hover:shadow-violet-900/30"
                    >
                      <span>Launch with Prompt</span>
                      <ExternalLink size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(platform.name)}
                      title="Copy Prompt"
                      className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Prompt Preview */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPromptPreview(!showPromptPreview)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/[0.03] transition"
          >
            <div className="flex items-center gap-2">
              <Code2 size={15} className="text-violet-400" />
              <span>Preview Full Contextual Prompt ({fullPrompt.length} characters)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>{showPromptPreview ? "Hide" : "View"}</span>
              {showPromptPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </button>

          {showPromptPreview && (
            <div className="p-4 border-t border-white/10 bg-black/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Structured Context Blueprint</span>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt()}
                  className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium"
                >
                  <Copy size={12} /> Copy to Clipboard
                </button>
              </div>
              <pre className="max-h-56 overflow-y-auto rounded-xl bg-black/50 p-3 text-[11px] font-mono text-slate-300 leading-5 whitespace-pre-wrap select-all border border-white/5">
                {fullPrompt}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <Lightbulb size={16} /> Submit Another Idea
          </button>

          <Link
            to={`/idea/${createdIdeaId}`}
            className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition"
          >
            View Published Idea <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
