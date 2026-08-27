import { Link } from "react-router-dom";

export default function IdeasFeedLoadingPage() {
  return (
    <>
      
<div className="fixed inset-0 pointer-events-none bg-dot-pattern opacity-60 z-0"></div>
<nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e5e0] shadow-sm">
<div className="flex justify-between items-center px-8 h-16 max-w-7xl mx-auto">
<div className="text-xl font-black text-[#0a0a0a] tracking-tighter font-headline">IdeaForge</div>
<div className="hidden md:flex space-x-8 items-center h-full">
<Link className="h-full flex items-center text-[#6c3ce0] font-bold border-b-2 border-[#6c3ce0] font-headline tracking-tight" to="/explore">Explore</Link>
<Link className="h-full flex items-center text-[#555555] hover:text-[#6c3ce0] transition-colors duration-300 font-headline tracking-tight" to="/submit">Submit Idea</Link>
<Link className="h-full flex items-center text-[#555555] hover:text-[#6c3ce0] transition-colors duration-300 font-headline tracking-tight" to="/dashboard">Dashboard</Link>
<Link className="h-full flex items-center text-[#555555] hover:text-[#6c3ce0] transition-colors duration-300 font-headline tracking-tight" to="/explore">Categories</Link>
</div>
<button className="bg-[#0a0a0a] text-white hover:bg-[#6c3ce0] transition-colors duration-300 rounded-full px-5 py-2.5 font-label uppercase tracking-[0.15em] text-xs font-bold hover:scale-95 transform">
                Get Started
            </button>
</div>
</nav>
<div className="relative z-10 pt-28 pb-12 px-8 max-w-7xl mx-auto">
<header className="mb-12">
<h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0a0a0a] mb-6 font-headline">
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c3ce0] via-[#8b5cf6] to-purple-400">Discover</span> Ideas.
            </h1>
<div className="flex flex-wrap gap-3 mt-8 items-center">
<div className="h-10 w-10 bg-[#e5e5e0] rounded-full animate-pulse"></div>
<div className="h-10 w-28 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
<div className="h-10 w-32 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-10 w-24 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
<div className="h-10 w-36 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
</header>
<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
<article className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e5e0] shadow-sm p-6 flex flex-col h-[340px]">
<div className="flex justify-between items-center mb-4">
<div className="h-6 w-24 bg-[#e5e5e0] rounded-md animate-pulse"></div>
<div className="h-4 w-12 bg-[#f5f5f0] rounded-md animate-pulse"></div>
</div>
<div className="space-y-3 mb-6">
<div className="h-8 w-11/12 bg-[#e5e5e0] rounded-md animate-pulse"></div>
<div className="h-8 w-3/4 bg-[#e5e5e0] rounded-md animate-pulse"></div>
</div>
<div className="space-y-2 mb-6 flex-grow">
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '100ms'}}></div>
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-4 w-4/5 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
</div>
<div className="flex gap-2 mb-6">
<div className="h-6 w-16 bg-[#f5f5f0] rounded-full animate-pulse"></div>
<div className="h-6 w-20 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
</div>
<div className="mt-auto pt-4 flex justify-between items-center border-t border-[#f5f5f0]">
<div className="flex items-center gap-3">
<div className="h-8 w-8 bg-[#e5e5e0] rounded-full animate-pulse"></div>
<div className="h-4 w-20 bg-[#f5f5f0] rounded-md animate-pulse"></div>
</div>
<div className="flex gap-4">
<div className="h-6 w-12 bg-[#f5f5f0] rounded-md animate-pulse"></div>
<div className="h-6 w-12 bg-[#f5f5f0] rounded-md animate-pulse"></div>
</div>
</div>
</article>
<article className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e5e0] shadow-sm p-6 flex flex-col h-[340px]">
<div className="flex justify-between items-center mb-4">
<div className="h-6 w-20 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-4 w-16 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
</div>
<div className="space-y-3 mb-6">
<div className="h-8 w-full bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-8 w-2/3 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
</div>
<div className="space-y-2 mb-6 flex-grow">
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '300ms'}}></div>
<div className="h-4 w-11/12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
<div className="h-4 w-3/4 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
<div className="flex gap-2 mb-6">
<div className="h-6 w-24 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-6 w-16 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
<div className="h-6 w-20 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
<div className="mt-auto pt-4 flex justify-between items-center border-t border-[#f5f5f0]">
<div className="flex items-center gap-3">
<div className="h-8 w-8 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-4 w-24 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
</div>
<div className="flex gap-4">
<div className="h-6 w-14 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-6 w-10 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
</div>
</div>
</article>
<article className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e5e0] shadow-sm p-6 flex flex-col h-[340px]">
<div className="flex justify-between items-center mb-4">
<div className="h-6 w-28 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
<div className="h-4 w-10 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
<div className="space-y-3 mb-6">
<div className="h-8 w-10/12 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
<div className="h-8 w-1/2 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
<div className="space-y-2 mb-6 flex-grow">
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '500ms'}}></div>
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '550ms'}}></div>
<div className="h-4 w-5/6 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '600ms'}}></div>
</div>
<div className="flex gap-2 mb-6">
<div className="h-6 w-20 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
<div className="mt-auto pt-4 flex justify-between items-center border-t border-[#f5f5f0]">
<div className="flex items-center gap-3">
<div className="h-8 w-8 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
<div className="h-4 w-16 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
<div className="flex gap-4">
<div className="h-6 w-12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
<div className="h-6 w-12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '400ms'}}></div>
</div>
</div>
</article>
<article className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e5e0] shadow-sm p-6 flex flex-col h-[340px]">
<div className="flex justify-between items-center mb-4">
<div className="h-6 w-16 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-4 w-14 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
</div>
<div className="space-y-3 mb-6">
<div className="h-8 w-full bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-8 w-4/5 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
</div>
<div className="space-y-2 mb-6 flex-grow">
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '250ms'}}></div>
<div className="h-4 w-11/12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '300ms'}}></div>
<div className="h-4 w-2/3 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
</div>
<div className="flex gap-2 mb-6">
<div className="h-6 w-24 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-6 w-20 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '250ms'}}></div>
</div>
<div className="mt-auto pt-4 flex justify-between items-center border-t border-[#f5f5f0]">
<div className="flex items-center gap-3">
<div className="h-8 w-8 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-4 w-28 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
</div>
<div className="flex gap-4">
<div className="h-6 w-10 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-6 w-14 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
</div>
</div>
</article>
<article className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e5e0] shadow-sm p-6 flex flex-col h-[340px]">
<div className="flex justify-between items-center mb-4">
<div className="h-6 w-24 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
<div className="h-4 w-10 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
</div>
<div className="space-y-3 mb-6">
<div className="h-8 w-11/12 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
<div className="h-8 w-3/4 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
</div>
<div className="space-y-2 mb-6 flex-grow">
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '450ms'}}></div>
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '500ms'}}></div>
<div className="h-4 w-5/6 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '550ms'}}></div>
</div>
<div className="flex gap-2 mb-6">
<div className="h-6 w-16 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '350ms'}}></div>
<div className="h-6 w-24 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '450ms'}}></div>
<div className="h-6 w-16 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '550ms'}}></div>
</div>
<div className="mt-auto pt-4 flex justify-between items-center border-t border-[#f5f5f0]">
<div className="flex items-center gap-3">
<div className="h-8 w-8 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '350ms'}}></div>
<div className="h-4 w-16 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
</div>
<div className="flex gap-4">
<div className="h-6 w-12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
<div className="h-6 w-12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '350ms'}}></div>
</div>
</div>
</article>
<article className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#e5e5e0] shadow-sm p-6 flex flex-col h-[340px]">
<div className="flex justify-between items-center mb-4">
<div className="h-6 w-20 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
<div className="h-4 w-16 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
</div>
<div className="space-y-3 mb-6">
<div className="h-8 w-10/12 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
<div className="h-8 w-2/3 bg-[#e5e5e0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
</div>
<div className="space-y-2 mb-6 flex-grow">
<div className="h-4 w-full bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '150ms'}}></div>
<div className="h-4 w-11/12 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '200ms'}}></div>
<div className="h-4 w-4/5 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '250ms'}}></div>
</div>
<div className="flex gap-2 mb-6">
<div className="h-6 w-20 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '50ms'}}></div>
<div className="h-6 w-20 bg-[#f5f5f0] rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
</div>
<div className="mt-auto pt-4 flex justify-between items-center border-t border-[#f5f5f0]">
<div className="flex items-center gap-3">
<div className="h-8 w-8 bg-[#e5e5e0] rounded-full animate-pulse" style={{animationDelay: '50ms'}}></div>
<div className="h-4 w-20 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
</div>
<div className="flex gap-4">
<div className="h-6 w-14 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
<div className="h-6 w-10 bg-[#f5f5f0] rounded-md animate-pulse" style={{animationDelay: '50ms'}}></div>
</div>
</div>
</article>
</main>
</div>
<footer className="bg-[#0a0a0a] w-full py-12 border-t border-[#333333] mt-auto relative z-10">
<div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-8">
<div className="text-lg font-black text-white font-headline tracking-tighter">IdeaForge</div>
<div className="flex flex-wrap justify-center gap-6 md:gap-8">
<a className="text-[#aaaaaa] hover:text-[#8b5cf6] transition-colors duration-300 font-body text-sm hover:text-white" href="#">Privacy Policy</a>
<a className="text-[#aaaaaa] hover:text-[#8b5cf6] transition-colors duration-300 font-body text-sm hover:text-white" href="#">Terms of Service</a>
<a className="text-[#aaaaaa] hover:text-[#8b5cf6] transition-colors duration-300 font-body text-sm hover:text-white" href="#">Contact</a>
<a className="text-[#aaaaaa] hover:text-[#8b5cf6] transition-colors duration-300 font-body text-sm hover:text-white" href="#">Changelog</a>
</div>
<div className="font-body text-[#aaaaaa] text-sm text-center md:text-right">
                © 2024 IdeaForge. Built for innovators.
            </div>
</div>
</footer>

    </>
  );
}
