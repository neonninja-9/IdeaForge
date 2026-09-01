import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coins, Settings, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import walletService from "../../services/walletService";
import type { Idea, Wallet, WalletTransaction } from "../../types/idea.types";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
}

const TYPE_LABELS: Record<string, string> = {
  idea_submit: "Idea Published",
  vote_milestone: "Vote Milestone",
  comment_received: "Comment Earned",
  featured: "Featured",
  manual_adjustment: "Adjustment",
};

export default function UserProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [loadingTx, setLoadingTx] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [isLoading, navigate, user]);

  useEffect(() => {
    if (!user) return;
    ideaService
      .getMyIdeas()
      .then((response) => setIdeas(response.data.ideas))
      .catch(console.error)
      .finally(() => setLoadingIdeas(false));

    walletService
      .getWallet()
      .then((res) => setWallet(res.data.wallet))
      .catch(console.error);

    walletService
      .getTransactions({ page: 1, limit: 10 })
      .then((res) => {
        setTransactions(res.data.transactions);
        setTxTotalPages(res.data.totalPages);
      })
      .catch(console.error);
  }, [user]);

  function loadMoreTransactions() {
    const nextPage = txPage + 1;
    setLoadingTx(true);
    walletService
      .getTransactions({ page: nextPage, limit: 10 })
      .then((res) => {
        setTransactions((prev) => [...prev, ...res.data.transactions]);
        setTxPage(nextPage);
        setTxTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoadingTx(false));
  }

  if (isLoading || !user) {
    return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent"><PageSkeleton variant="profile" /></div>;
  }

  const totalVotes = ideas.reduce((sum, idea) => sum + (idea.voteCount || 0), 0);
  const initial = user.username.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent py-7 sm:py-10 transition-colors duration-500">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 xl:px-12">
        <section className="relative overflow-hidden rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none sm:p-9 transition-colors">
          <div className="absolute -right-20 -top-24 size-64 rounded-full bg-indigo-100/70 dark:bg-white/5 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#fa520f] to-[#ffa110] text-2xl font-black text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none">{initial}</div>
              <div>
                <p className="mb-1 text-sm font-semibold text-[#fa520f] dark:text-[#fa520f]">YOUR PROFILE</p>
                <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{user.username}</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/settings" className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 transition hover:border-[#e6d5a8] dark:hover:border-white/15 hover:text-[#fa520f] dark:hover:text-white" aria-label="Open settings">
                <Settings size={18} />
              </Link>
              <Link to="/submit" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#fa520f] px-5 text-sm font-semibold text-white shadow-md shadow-[#fa520f1a] dark:shadow-none transition-colors hover:bg-[#cc3a05]">
                Submit an idea
              </Link>
            </div>
          </div>
          <dl className="relative mt-8 grid grid-cols-2 sm:grid-cols-4 gap-y-4 border-t border-slate-100 dark:border-white/5 pt-6">
            <div>
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">IDEAS</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loadingIdeas ? "—" : ideas.length}</dd>
            </div>
            <div className="sm:border-x border-slate-100 dark:border-white/5 sm:px-5 lg:px-8">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">VOTES EARNED</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loadingIdeas ? "—" : totalVotes}</dd>
            </div>
            <div className="sm:border-r border-slate-100 dark:border-white/5 sm:px-5 lg:px-8">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">FORGECOINS</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-2xl font-bold text-[#fa520f]">
                <Coins size={18} className="text-[#ff8105]" />
                {wallet ? wallet.balance.toLocaleString() : "—"}
              </dd>
            </div>
            <div className="sm:pl-5 lg:pl-8">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">MEMBER SINCE</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</dd>
            </div>
          </dl>
        </section>

        {/* ── Wallet & Earnings ── */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">Wallet & Earnings</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your ForgeCoin rewards for contributing ideas and engaging the community.</p>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-gradient-to-br from-[#fa520f] to-[#ff8105] p-6 text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Coins size={16} /> Current Balance
              </div>
              <p className="mt-3 text-4xl font-bold tracking-tight">{wallet ? wallet.balance.toLocaleString() : "—"} <span className="text-lg font-medium text-white/70">FC</span></p>
            </div>
            <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500">
                <ArrowUpRight size={16} className="text-emerald-500" /> Lifetime Earnings
              </div>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{wallet ? wallet.lifetimeEarnings.toLocaleString() : "—"} <span className="text-lg font-medium text-slate-400 dark:text-slate-500">FC</span></p>
            </div>
          </div>

          {/* Transaction history */}
          {transactions.length > 0 && (
            <div className="mt-6 rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] shadow-sm dark:shadow-none overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Transactions</h3>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-white/5">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tx.amount > 0 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400"}`}>
                      {tx.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{TYPE_LABELS[tx.type] || tx.type}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {tx.reason}
                        {tx.relatedIdea && (
                          <> · <Link to={`/idea/${tx.relatedIdea.id}`} className="text-[#fa520f] hover:underline">{tx.relatedIdea.title}</Link></>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount} FC
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(tx.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {txPage < txTotalPages && (
                <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={loadMoreTransactions}
                    disabled={loadingTx}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#fa520f] hover:text-[#cc3a05] transition-colors disabled:opacity-50"
                  >
                    {loadingTx ? "Loading…" : "Load more"} <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Your ideas ── */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">Your ideas</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Everything you have shared with the community.</p>
            </div>
            <Link to="/dashboard" className="text-sm font-semibold text-[#fa520f] dark:text-[#fa520f] hover:text-[#cc3a05] dark:hover:text-indigo-300">Dashboard &rarr;</Link>
          </div>
          {loadingIdeas ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-44 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
              <div className="h-44 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
            </div>
          ) : ideas.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#e6d5a8] dark:border-white/10 bg-white dark:bg-[#120F17] p-10 text-center">
              <p className="font-heading text-lg font-bold text-slate-900 dark:text-white">Your first idea starts here.</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Share a problem you care about and turn it into a project.</p>
              <Link to="/submit" className="mt-5 inline-block text-sm font-semibold text-[#fa520f] dark:text-[#fa520f] hover:text-[#cc3a05] dark:hover:text-indigo-300">Create an idea &rarr;</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {ideas.map((idea) => (
                <Link
                  key={idea.id || idea._id}
                  to={`/idea/${idea.id || idea._id}`}
                  className="group rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-sm dark:shadow-none transition-all hover:-translate-y-0.5 hover:border-[#e6d5a8] dark:hover:border-white/15 hover:shadow-md"
                >
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#fa520f] dark:text-[#fa520f]">{idea.category?.name || "Uncategorized"}</p>
                  <h3 className="mt-2 font-bold text-slate-900 dark:text-white group-hover:text-[#fa520f] dark:group-hover:text-[#fa520f]">{idea.title}</h3>
                  <div className="mt-4 flex gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <span>↑ {idea.voteCount || 0} votes</span>
                    <span>{idea.commentCount || 0} comments</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
