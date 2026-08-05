import { Link } from "react-router-dom";

export default function IdeaDetailLoadingPage() {
  return (
    <>
      
{/*  Top Navigation (JSON)  */}
<nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-[#e5e5e0] dark:border-[#333333] shadow-sm">
<div className="flex justify-between items-center px-8 h-16 max-w-7xl mx-auto">
<div className="flex items-center gap-8">
<Link className="text-xl font-black text-[#0a0a0a] dark:text-[#ffffff] tracking-tighter hover:opacity-80 transition-all duration-300" to="/">IdeaForge</Link>
<div className="hidden md:flex gap-6 items-center">
<Link className="text-[#6c3ce0] font-bold border-b-2 border-[#6c3ce0] pb-1 hover:opacity-80 transition-all duration-300" to="/explore">Explore</Link>
<Link className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 hover:opacity-80 transition-all duration-300" to="/submit">Submit Idea</Link>
<Link className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 hover:opacity-80 transition-all duration-300" to="/dashboard">Dashboard</Link>
<Link className="text-[#555555] dark:text-[#aaaaaa] hover:text-[#6c3ce0] transition-colors duration-300 hover:opacity-80 transition-all duration-300" to="/explore">Categories</Link>
</div>
</div>
<div className="flex items-center gap-4">
<button className="px-5 py-2 bg-[#6c3ce0] text-white rounded-full font-label text-sm uppercase tracking-wider hover:bg-[#8b5cf6] transition-colors duration-300 hover:opacity-80 transition-all duration-300">Get Started</button>
</div>
</div>
</nav>
<main className="max-w-7xl mx-auto px-4 md:px-8">
{/*  Breadcrumb Skeleton  */}
<div className="flex items-center gap-2 mb-8">
<div className="skeleton-block w-16 h-4 rounded"></div>
<span className="text-foreground-muted text-sm" aria-hidden="true">›</span>
<div className="skeleton-block w-24 h-4 rounded"></div>
<span className="text-foreground-muted text-sm" aria-hidden="true">›</span>
<div className="skeleton-block w-32 h-4 rounded"></div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
{/*  Left Column: Main Content Skeleton  */}
<div className="lg:col-span-8 flex flex-col gap-8">
{/*  Header Area  */}
<div className="flex flex-col gap-4">
<div className="skeleton-block w-20 h-6 rounded-full"></div> {/*  Badge  */}
<div className="flex flex-col gap-2">
<div className="skeleton-block w-full h-12 md:h-16 rounded-lg"></div> {/*  Title Line 1  */}
<div className="skeleton-block w-3/4 h-12 md:h-16 rounded-lg"></div> {/*  Title Line 2  */}
</div>
</div>
{/*  Author Row  */}
<div className="flex items-center gap-4 py-4 border-y border-border">
<div className="skeleton-block w-12 h-12 rounded-full"></div> {/*  Avatar  */}
<div className="flex flex-col gap-2 flex-grow">
<div className="skeleton-block w-32 h-4 rounded"></div> {/*  Name  */}
<div className="skeleton-block w-24 h-3 rounded"></div> {/*  Date  */}
</div>
<div className="flex gap-2">
<div className="skeleton-block w-8 h-8 rounded-full"></div> {/*  Action  */}
<div className="skeleton-block w-8 h-8 rounded-full"></div> {/*  Action  */}
</div>
</div>
{/*  Problem Section  */}
<div className="flex flex-col gap-4 mt-4">
<div className="skeleton-block w-1/3 h-6 rounded"></div> {/*  Subheading  */}
<div className="flex flex-col gap-3">
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-11/12 h-4 rounded"></div>
<div className="skeleton-block w-4/5 h-4 rounded"></div>
</div>
</div>
{/*  Solution Section  */}
<div className="flex flex-col gap-4 mt-6">
<div className="skeleton-block w-1/4 h-6 rounded"></div> {/*  Subheading  */}
{/*  Image Placeholder  */}
<div className="skeleton-block w-full h-64 md:h-96 rounded-2xl my-4"></div>
<div className="flex flex-col gap-3">
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-10/12 h-4 rounded"></div>
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-5/6 h-4 rounded"></div>
</div>
</div>
{/*  Tags  */}
<div className="flex flex-wrap gap-3 mt-8">
<div className="skeleton-block w-16 h-8 rounded-full"></div>
<div className="skeleton-block w-24 h-8 rounded-full"></div>
<div className="skeleton-block w-20 h-8 rounded-full"></div>
<div className="skeleton-block w-28 h-8 rounded-full"></div>
</div>
{/*  Action Bar (Sticky Bottom)  */}
<div className="sticky bottom-4 w-full bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-border shadow-sm flex justify-between items-center mt-12">
<div className="flex items-center gap-4">
<div className="skeleton-block w-24 h-10 rounded-full"></div>
<div className="skeleton-block w-10 h-10 rounded-full"></div>
</div>
<div className="skeleton-block w-32 h-10 rounded-full"></div>
</div>
</div>
{/*  Right Column: Sidebar Skeleton  */}
<div className="lg:col-span-4 flex flex-col gap-8">
{/*  About Author Card  */}
<div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
<div className="skeleton-block w-1/3 h-5 rounded mb-6"></div> {/*  Card Title  */}
<div className="flex flex-col items-center text-center gap-4">
<div className="skeleton-block w-20 h-20 rounded-full"></div> {/*  Avatar  */}
<div className="skeleton-block w-32 h-5 rounded"></div> {/*  Name  */}
<div className="skeleton-block w-full h-3 rounded mt-2"></div> {/*  Bio  */}
<div className="skeleton-block w-5/6 h-3 rounded"></div> {/*  Bio  */}
<div className="skeleton-block w-full h-10 rounded-full mt-4"></div> {/*  Follow Button  */}
</div>
</div>
{/*  Similar Ideas Card  */}
<div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
<div className="skeleton-block w-1/2 h-5 rounded mb-6"></div> {/*  Card Title  */}
<div className="flex flex-col gap-6">
{/*  Idea Item 1  */}
<div className="flex flex-col gap-2">
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-3/4 h-4 rounded"></div>
<div className="flex justify-between mt-2">
<div className="skeleton-block w-16 h-3 rounded"></div>
<div className="skeleton-block w-12 h-3 rounded"></div>
</div>
</div>
{/*  Idea Item 2  */}
<div className="flex flex-col gap-2">
<div className="skeleton-block w-full h-4 rounded"></div>
<div className="skeleton-block w-4/5 h-4 rounded"></div>
<div className="flex justify-between mt-2">
<div className="skeleton-block w-20 h-3 rounded"></div>
<div className="skeleton-block w-10 h-3 rounded"></div>
</div>
</div>
{/*  Idea Item 3  */}
<div className="flex flex-col gap-2">
<div className="skeleton-block w-11/12 h-4 rounded"></div>
<div className="skeleton-block w-2/3 h-4 rounded"></div>
<div className="flex justify-between mt-2">
<div className="skeleton-block w-14 h-3 rounded"></div>
<div className="skeleton-block w-16 h-3 rounded"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
