import { Link } from "react-router-dom";

export default function UserProfileLoadingPage() {
  return (
    <>
      
<div className="fixed inset-0 dot-grid z-[-1] pointer-events-none"></div>
{/*  TopNavBar  */}
<header className="bg-white/80 dark:bg-black/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-[#e5e5e0] dark:border-[#333333] shadow-sm flex justify-between items-center px-8 h-16 mx-auto">
<div className="flex items-center gap-8">
<div className="text-xl font-black text-[#0a0a0a] dark:text-[#ffffff] tracking-tighter">IdeaForge</div>
<nav className="hidden md:flex gap-6">
<Link className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 font-label tracking-[0.1em] uppercase text-sm" to="/explore">Explore</Link>
<Link className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 font-label tracking-[0.1em] uppercase text-sm" to="/submit">Submit Idea</Link>
<Link className="text-[#6c3ce0] font-bold border-b-2 border-[#6c3ce0] pb-1 font-label tracking-[0.1em] uppercase text-sm" to="/dashboard">Dashboard</Link>
<Link className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 font-label tracking-[0.1em] uppercase text-sm" to="/explore">Categories</Link>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="bg-[#0a0a0a] text-white px-5 py-2 rounded-full font-label tracking-[0.1em] uppercase text-xs hover:bg-[#6c3ce0] transition-colors duration-300">Get Started</button>
</div>
</header>
<main className="flex-grow pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
{/*  Profile Header Skeleton  */}
<section className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 animate-pulse">
{/*  Avatar Skeleton  */}
<div className="w-32 h-32 rounded-full bg-surface-alt border-2 border-border/50 shrink-0 shadow-sm relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
</div>
{/*  Info Skeleton  */}
<div className="flex flex-col items-center md:items-start flex-grow w-full max-w-md gap-4 pt-2">
<div className="h-10 w-3/4 bg-border/40 rounded-lg relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
</div>
<div className="h-5 w-1/2 bg-border/40 rounded-md relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
</div>
{/*  Stats Row Skeleton  */}
<div className="flex gap-6 mt-4 w-full justify-center md:justify-start">
<div className="h-12 w-20 bg-border/40 rounded-lg relative overflow-hidden"></div>
<div className="h-12 w-20 bg-border/40 rounded-lg relative overflow-hidden"></div>
<div className="h-12 w-20 bg-border/40 rounded-lg relative overflow-hidden"></div>
</div>
</div>
</section>
{/*  Tabs Skeleton  */}
<div className="border-b border-border mb-8 flex gap-8 animate-pulse">
<div className="h-8 w-24 bg-border/60 rounded-t-md border-b-2 border-primary pb-2 relative overflow-hidden"></div>
<div className="h-8 w-32 bg-border/30 rounded-t-md pb-2 relative overflow-hidden"></div>
<div className="h-8 w-28 bg-border/30 rounded-t-md pb-2 relative overflow-hidden"></div>
</div>
{/*  Content Grid Skeleton  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/*  Skeleton Card 1  */}
<div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse relative overflow-hidden h-64">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
<div className="flex justify-between items-start">
<div className="h-6 w-1/3 bg-border/40 rounded-full"></div>
<div className="h-8 w-8 bg-border/40 rounded-full"></div>
</div>
<div className="h-8 w-3/4 bg-border/40 rounded-lg mt-2"></div>
<div className="space-y-2 flex-grow">
<div className="h-4 w-full bg-border/40 rounded-md"></div>
<div className="h-4 w-5/6 bg-border/40 rounded-md"></div>
<div className="h-4 w-4/6 bg-border/40 rounded-md"></div>
</div>
<div className="flex gap-2 mt-auto">
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
<div className="h-6 w-20 bg-border/40 rounded-full"></div>
</div>
</div>
{/*  Skeleton Card 2  */}
<div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse relative overflow-hidden h-64">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite_0.2s]"></div>
<div className="flex justify-between items-start">
<div className="h-6 w-1/4 bg-border/40 rounded-full"></div>
<div className="h-8 w-8 bg-border/40 rounded-full"></div>
</div>
<div className="h-8 w-2/3 bg-border/40 rounded-lg mt-2"></div>
<div className="space-y-2 flex-grow">
<div className="h-4 w-full bg-border/40 rounded-md"></div>
<div className="h-4 w-full bg-border/40 rounded-md"></div>
<div className="h-4 w-1/2 bg-border/40 rounded-md"></div>
</div>
<div className="flex gap-2 mt-auto">
<div className="h-6 w-24 bg-border/40 rounded-full"></div>
</div>
</div>
{/*  Skeleton Card 3  */}
<div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse relative overflow-hidden h-64">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite_0.4s]"></div>
<div className="flex justify-between items-start">
<div className="h-6 w-2/5 bg-border/40 rounded-full"></div>
<div className="h-8 w-8 bg-border/40 rounded-full"></div>
</div>
<div className="h-8 w-4/5 bg-border/40 rounded-lg mt-2"></div>
<div className="space-y-2 flex-grow">
<div className="h-4 w-11/12 bg-border/40 rounded-md"></div>
<div className="h-4 w-5/6 bg-border/40 rounded-md"></div>
</div>
<div className="flex gap-2 mt-auto">
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
</div>
</div>
{/*  Skeleton Card 4  */}
<div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse relative overflow-hidden h-64">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite_0.1s]"></div>
<div className="flex justify-between items-start">
<div className="h-6 w-1/3 bg-border/40 rounded-full"></div>
<div className="h-8 w-8 bg-border/40 rounded-full"></div>
</div>
<div className="h-8 w-3/4 bg-border/40 rounded-lg mt-2"></div>
<div className="space-y-2 flex-grow">
<div className="h-4 w-full bg-border/40 rounded-md"></div>
<div className="h-4 w-5/6 bg-border/40 rounded-md"></div>
<div className="h-4 w-4/6 bg-border/40 rounded-md"></div>
</div>
<div className="flex gap-2 mt-auto">
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
<div className="h-6 w-20 bg-border/40 rounded-full"></div>
</div>
</div>
{/*  Skeleton Card 5  */}
<div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse relative overflow-hidden h-64">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite_0.3s]"></div>
<div className="flex justify-between items-start">
<div className="h-6 w-1/4 bg-border/40 rounded-full"></div>
<div className="h-8 w-8 bg-border/40 rounded-full"></div>
</div>
<div className="h-8 w-2/3 bg-border/40 rounded-lg mt-2"></div>
<div className="space-y-2 flex-grow">
<div className="h-4 w-full bg-border/40 rounded-md"></div>
<div className="h-4 w-full bg-border/40 rounded-md"></div>
<div className="h-4 w-1/2 bg-border/40 rounded-md"></div>
</div>
<div className="flex gap-2 mt-auto">
<div className="h-6 w-24 bg-border/40 rounded-full"></div>
</div>
</div>
{/*  Skeleton Card 6  */}
<div className="bg-white/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse relative overflow-hidden h-64">
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite_0.5s]"></div>
<div className="flex justify-between items-start">
<div className="h-6 w-2/5 bg-border/40 rounded-full"></div>
<div className="h-8 w-8 bg-border/40 rounded-full"></div>
</div>
<div className="h-8 w-4/5 bg-border/40 rounded-lg mt-2"></div>
<div className="space-y-2 flex-grow">
<div className="h-4 w-11/12 bg-border/40 rounded-md"></div>
<div className="h-4 w-5/6 bg-border/40 rounded-md"></div>
</div>
<div className="flex gap-2 mt-auto">
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
<div className="h-6 w-16 bg-border/40 rounded-full"></div>
</div>
</div>
</div>
</main>
{/*  Footer  */}
<footer className="bg-[#0a0a0a] w-full py-12 border-t border-[#333333]">
<div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-6 md:gap-0">
<div className="text-lg font-black text-white tracking-tighter">IdeaForge</div>
<div className="flex gap-6">
<a className="text-[#aaaaaa] hover:text-white transition-colors text-sm font-body" href="#">Privacy Policy</a>
<a className="text-[#aaaaaa] hover:text-white transition-colors text-sm font-body" href="#">Terms of Service</a>
<a className="text-[#aaaaaa] hover:text-white transition-colors text-sm font-body" href="#">Contact</a>
<a className="text-[#aaaaaa] hover:text-white transition-colors text-sm font-body" href="#">Changelog</a>
</div>
<div className="text-[#aaaaaa] text-sm font-body">
                © 2024 IdeaForge. Built for innovators.
            </div>
</div>
</footer>
<style>{`
        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }
    `}</style>

    </>
  );
}
