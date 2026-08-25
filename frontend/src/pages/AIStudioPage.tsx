import { useEffect, useState } from "react";
import { ArrowUp, Bot, Lightbulb, LoaderCircle, MessageSquare, Plus, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import aiService, { type AiConversation, type AiMessage } from "../services/aiService";
import { useAuth } from "../hooks/useAuth";

const prompts = ["Improve this idea", "Find competitors", "Explore pricing", "Plan the MVP", "Create a pitch", "Find early users"];

export default function AIStudioPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      aiService.getConversations()
        .then((res) => {
          setConversations(res.data.conversations);
          if (res.data.conversations.length > 0) {
            const firstId = res.data.conversations[0]._id || res.data.conversations[0].id!;
            selectConversation(firstId);
          }
        })
        .catch(console.error);
    } else {
      setMessages([
        {
          _id: "default",
          conversation: "",
          role: "assistant",
          text: "Welcome to AI Studio preview. We are currently focusing on capturing raw ideas and community feedback. AI interactive co-piloting is in active development.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [user]);

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    setLoading(true);
    aiService.getMessages(id)
      .then((res) => setMessages(res.data.messages))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const startNewConversation = async () => {
    if (!user) return;
    try {
      const res = await aiService.createConversation();
      const newConv = res.data.conversation;
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv._id || newConv.id!);
      setMessages([res.data.initialMessage]);
    } catch (err) {
      console.error(err);
    }
  };

  async function send(value = message) {
    const text = value.trim();
    if (!text || thinking) return;

    setMessage("");
    setThinking(true);

    if (user) {
      let convId = activeConvId;
      if (!convId) {
        try {
          const res = await aiService.createConversation();
          const newConv = res.data.conversation;
          setConversations((prev) => [newConv, ...prev]);
          convId = newConv._id || newConv.id!;
          setActiveConvId(convId);
        } catch {
          setThinking(false);
          return;
        }
      }

      const tempUserMsg: AiMessage = {
        _id: Date.now().toString(),
        conversation: convId,
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      try {
        const response = await aiService.sendMessage(convId, text);
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== tempUserMsg._id),
          response.data.userMessage,
          response.data.assistantMessage,
        ]);
        aiService.getConversations().then((res) => setConversations(res.data.conversations)).catch(() => {});
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            _id: (Date.now() + 1).toString(),
            conversation: convId,
            role: "assistant",
            text: "AI Studio is currently in preview mode. Please focus on capturing your raw thoughts in the Idea Capture workspace.",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setThinking(false);
      }
    } else {
      const userMsg: AiMessage = { _id: Date.now().toString(), conversation: "", role: "user", text, createdAt: new Date().toISOString() };
      setMessages((prev) => [...prev, userMsg]);
      try {
        const response = await aiService.assist(text);
        setMessages((prev) => [
          ...prev,
          { _id: (Date.now() + 1).toString(), conversation: "", role: "assistant", text: response.data.message, createdAt: new Date().toISOString() },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { _id: (Date.now() + 1).toString(), conversation: "", role: "assistant", text: "AI Studio is currently in preview mode. Please focus on capturing your raw thoughts in the Idea Capture workspace.", createdAt: new Date().toISOString() },
        ]);
      } finally {
        setThinking(false);
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <div className="mx-auto max-w-[1180px]">
        {/* Top Notice: Coming Soon */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-500/10 p-4 text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold">AI Studio is in Early Preview · Coming Soon</p>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">IdeaForge is currently focusing on capturing raw ideas and presenting them to the community.</p>
            </div>
          </div>
          <Link to="/submit" className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 whitespace-nowrap">
            Capture raw idea &rarr;
          </Link>
        </div>

        <main className="grid gap-7 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Sparkles size={21} />
                </span>
                {user && (
                  <button
                    onClick={startNewConversation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-2 rounded-xl transition"
                  >
                    <Plus size={14} /> New Chat
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-6">
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">AI STUDIO</p>
                <span className="rounded-full bg-violet-100 dark:bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-400">Preview</span>
              </div>
              <h1 className="font-heading mt-1 text-2xl font-bold text-slate-900 dark:text-white">Your creative cofounder.</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Explore your thoughts interactively.</p>

              {user && conversations.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">History</p>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {conversations.map((conv) => {
                      const id = conv._id || conv.id!;
                      const active = id === activeConvId;
                      return (
                        <button
                          key={id}
                          onClick={() => selectConversation(id)}
                          className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition truncate ${
                            active ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                          }`}
                        >
                          <MessageSquare size={14} className="shrink-0" />
                          <span className="truncate">{conv.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Prompts</p>
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 dark:bg-white/5 px-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-400"
                  >
                    <span>{prompt}</span>
                    <ArrowUp size={14} />
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-3 text-xs leading-5 text-amber-800 dark:text-amber-400">
              Responses are delivered by the secured IdeaForge API & powered by Gemini.
            </p>
          </aside>

          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[28px] border border-indigo-100 dark:border-indigo-500/20 bg-white dark:bg-[#120F17] shadow-[0_18px_50px_-32px_rgba(79,70,229,.4)] dark:shadow-none transition-colors">
            <header className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 px-6 py-5">
              <span className="grid size-10 place-items-center rounded-2xl bg-white dark:bg-[#120F17] text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none">
                <Bot size={20} />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">IdeaForge AI</h2>
                <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> Preview mode
                </p>
              </div>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
              {loading ? (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  <LoaderCircle size={20} className="animate-spin mr-2" /> Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  Start a conversation to shape your idea.
                </div>
              ) : (
                messages.map((item) => (
                  <div key={item._id || item.id} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        item.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {item.role === "assistant" && <Lightbulb size={15} className="mb-2 text-violet-500 dark:text-violet-400" />}
                      {item.text}
                    </div>
                  </div>
                ))
              )}
              {thinking && (
                <div className="flex">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                    <LoaderCircle size={16} className="animate-spin text-indigo-500" /> Thinking with you...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
              className="border-t border-slate-100 dark:border-white/5 p-4 sm:p-5"
            >
              <div className="flex items-end gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fcfcfd] dark:bg-[#1a1625] p-2 focus-within:border-indigo-300 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50 dark:focus-within:ring-indigo-500/10">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={2}
                  placeholder="Ask anything about your idea..."
                  className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || thinking}
                  className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
