import React from 'react';

export default function UserProfilePage() {
  return (
    <>
      
{/*  TopNavBar  */}
<nav className="bg-white/80 dark:bg-black/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-[#e5e5e0] dark:border-[#333333] shadow-sm">
<div className="flex justify-between items-center px-8 h-16 max-w-7xl mx-auto">
<div className="text-xl font-black text-[#0a0a0a] dark:text-[#ffffff] tracking-tighter">IdeaForge</div>
<div className="hidden md:flex gap-8">
<a className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 font-label tracking-widest uppercase text-sm" href="#">Explore</a>
<a className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 font-label tracking-widest uppercase text-sm" href="#">Submit Idea</a>
<a className="text-[#6c3ce0] font-bold border-b-2 border-[#6c3ce0] pb-1 font-label tracking-widest uppercase text-sm" href="#">Dashboard</a>
<a className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 font-label tracking-widest uppercase text-sm" href="#">Categories</a>
</div>
<button className="bg-[#6c3ce0] text-white px-6 py-2 rounded-full font-label tracking-widest uppercase text-xs hover:bg-[#8b5cf6] transition-colors duration-300 hover:scale-95">Get Started</button>
</div>
</nav>
{/*  Main Content  */}
<main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
{/*  Profile Header  */}
<section className="bg-surface-alt rounded-3xl p-8 mb-12 relative overflow-hidden dot-pattern border border-border">
<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
<div className="flex items-center gap-6">
<div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-headline font-black shrink-0 border-2 border-primary/20">
                        S
                    </div>
<div>
<div className="flex items-center gap-3 mb-1">
<h1 className="text-2xl font-headline font-black tracking-tight text-foreground">Sarah Jenkins</h1>
<span className="bg-primary/10 text-primary text-[10px] font-label uppercase tracking-wider px-2 py-1 rounded-full font-bold">Pro User</span>
</div>
<p className="text-foreground-muted text-sm mb-3">sarah.j@example.com</p>
<div className="flex flex-wrap items-center gap-y-2 text-sm text-foreground-mid">
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">calendar_month</span>
<span>Joined June 2023</span>
</div>
<span className="mx-3 text-border hidden sm:inline">|</span>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">lightbulb</span>
<span className="font-medium text-foreground">12</span> Ideas Posted
                            </div>
<span className="mx-3 text-border hidden sm:inline">|</span>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">thumb_up</span>
<span className="font-medium text-foreground">342</span> Total Votes
                            </div>
<span className="mx-3 text-border hidden md:inline">|</span>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">chat_bubble</span>
<span className="font-medium text-foreground">56</span> Comments
                            </div>
</div>
</div>
</div>
<button className="flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm font-label uppercase tracking-widest text-foreground hover:border-primary hover:text-primary transition-colors bg-white/50 backdrop-blur-sm">
<span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit Profile
                </button>
</div>
</section>
{/*  Tabs  */}
<div className="flex border-b border-border mb-8 gap-8 overflow-x-auto no-scrollbar">
<button className="pb-4 text-primary font-bold border-b-2 border-primary font-label uppercase tracking-widest text-sm whitespace-nowrap">My Ideas</button>
<button className="pb-4 text-foreground-muted hover:text-primary transition-colors font-label uppercase tracking-widest text-sm whitespace-nowrap">Voted Ideas</button>
<button className="pb-4 text-foreground-muted hover:text-primary transition-colors font-label uppercase tracking-widest text-sm whitespace-nowrap">Comments</button>
</div>
{/*  Ideas Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/*  Idea Card 1  */}
<article className="bg-surface/80 backdrop-blur-md rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full cursor-pointer hover:border-primary/30">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-2">
<span className="bg-blue-50 text-blue-600 text-[10px] font-label uppercase tracking-wider px-2 py-1 rounded-full border border-blue-100">DevTools</span>
<span className="bg-green-50 text-green-600 text-[10px] font-label uppercase tracking-wider px-2 py-1 rounded-full border border-green-100">Active</span>
</div>
<button className="text-foreground-muted hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]" data-icon="more_vert">more_vert</span>
</button>
</div>
<h3 className="text-lg font-headline font-bold text-foreground mb-2 group-hover:text-primary transition-colors">AI-Powered Code Auditor</h3>
<p className="text-foreground-mid text-sm mb-6 flex-grow line-clamp-3">A developer tool that uses LLMs to review pull requests, suggesting security fixes, performance optimizations, and ensuring stylistic consistency before human review.</p>
<div className="flex items-center justify-between pt-4 border-t border-border/50">
<div className="flex gap-4 text-sm text-foreground-muted">
<div className="flex items-center gap-1 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[16px]" data-icon="thumb_up">thumb_up</span>
<span>156</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]" data-icon="chat_bubble">chat_bubble</span>
<span>24</span>
</div>
</div>
<span className="text-xs text-foreground-muted">2 days ago</span>
</div>
</article>
{/*  Idea Card 2  */}
<article className="bg-surface/80 backdrop-blur-md rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full cursor-pointer hover:border-primary/30">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-2">
<span className="bg-purple-50 text-purple-600 text-[10px] font-label uppercase tracking-wider px-2 py-1 rounded-full border border-purple-100">Productivity</span>
<span className="bg-orange-50 text-orange-600 text-[10px] font-label uppercase tracking-wider px-2 py-1 rounded-full border border-orange-100">In Review</span>
</div>
<button className="text-foreground-muted hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]" data-icon="more_vert">more_vert</span>
</button>
</div>
<h3 className="text-lg font-headline font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Decentralized Task Manager</h3>
<p className="text-foreground-mid text-sm mb-6 flex-grow line-clamp-3">A peer-to-peer task management system designed for ad-hoc distributed teams, removing the need for a central server while maintaining data integrity through a local-first architecture.</p>
<div className="flex items-center justify-between pt-4 border-t border-border/50">
<div className="flex gap-4 text-sm text-foreground-muted">
<div className="flex items-center gap-1 group-hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[16px]" data-icon="thumb_up">thumb_up</span>
<span>89</span>
</div>
<div className="flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]" data-icon="chat_bubble">chat_bubble</span>
<span>12</span>
</div>
</div>
<span className="text-xs text-foreground-muted">1 week ago</span>
</div>
</article>
{/*  Empty State / Add New  */}
<article className="bg-surface-alt/50 rounded-2xl border border-dashed border-border p-6 flex flex-col items-center justify-center text-center min-h-[240px] hover:bg-surface-alt hover:border-primary/50 transition-all duration-300 cursor-pointer group">
<div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4 group-hover:text-primary group-hover:border-primary/30 transition-colors">
<span className="material-symbols-outlined text-[24px]">add</span>
</div>
<h3 className="font-headline font-bold text-foreground mb-1">Submit New Idea</h3>
<p className="text-sm text-foreground-muted">Got another spark of inspiration? Share it with the community.</p>
</article>
</div>
</main>
{/*  Footer  */}
<footer className="bg-[#0a0a0a] w-full py-12 border-t border-[#333333] mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto w-full gap-6">
<div className="text-lg font-black text-white">IdeaForge</div>
<div className="flex flex-wrap justify-center gap-6">
<a className="font-body text-[#aaaaaa] hover:text-[#8b5cf6] text-sm transition-colors" href="#">Privacy Policy</a>
<a className="font-body text-[#aaaaaa] hover:text-[#8b5cf6] text-sm transition-colors" href="#">Terms of Service</a>
<a className="font-body text-[#aaaaaa] hover:text-[#8b5cf6] text-sm transition-colors" href="#">Contact</a>
<a className="font-body text-[#aaaaaa] hover:text-[#8b5cf6] text-sm transition-colors" href="#">Changelog</a>
</div>
<div className="font-body text-[#aaaaaa] text-sm">© 2024 IdeaForge. Built for innovators.</div>
</div>
</footer>

    </>
  );
}
