import { Link } from "react-router-dom";

const footerLinks: Record<string, { label: string; to?: string; href?: string }[]> = {
  Product: [
    { label: "Explore Ideas", to: "/explore" },
    { label: "Submit Idea", to: "/submit" },
    { label: "Dashboard", to: "/dashboard" },
  ],
  Developer: [
    { label: "Documentation", href: "#" },
    { label: "Status", href: "#" },
    { label: "Open Source", href: "#" },
    { label: "GitHub", href: "https://github.com/neonninja-9/IdeaForge" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#090a0c] text-white pt-16 sm:pt-20 pb-10 px-5 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 mb-14 sm:grid-cols-2 sm:gap-12 sm:mb-20 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-2xl font-black mb-4 block hover:text-[#8fb0ef] transition-colors">IdeaForge</Link>
            <p className="text-sm text-[#a9a9aa] leading-relaxed mb-5">
              A calm operating layer for ideas, decisions, projects, and launch narratives.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-[#111111] border border-[#4a4b50] flex items-center justify-center text-[#a9a9aa] hover:text-white hover:border-[#5683da] transition-all duration-300" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://github.com/neonninja-9/IdeaForge" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#111111] border border-[#4a4b50] flex items-center justify-center text-[#a9a9aa] hover:text-white hover:border-[#5683da] transition-all duration-300" aria-label="GitHub">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#111111] border border-[#4a4b50] flex items-center justify-center text-[#a9a9aa] hover:text-white hover:border-[#5683da] transition-all duration-300" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-mono uppercase text-[#95979e] mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-[#a9a9aa] hover:text-white transition-colors duration-300">{link.label}</Link>
                    ) : (
                      <a
                        href={link.href}
                        {...(link.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-sm text-[#a9a9aa] hover:text-white transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[11px] font-mono uppercase text-[#95979e] mb-5">Newsletter</h4>
            <p className="text-sm text-[#a9a9aa] mb-5 leading-relaxed">Stay ahead of the curve with our weekly editorial on idea architecture.</p>
            <div className="flex flex-col gap-2 min-[420px]:flex-row">
              <input type="email" placeholder="Email" aria-label="Email address for newsletter" className="min-h-11 flex-1 px-4 py-2.5 text-sm bg-[#111111] border border-[#4a4b50] rounded text-white placeholder:text-[#95979e] focus:outline-none focus:border-[#5683da] transition-colors" />
              <button className="min-h-11 px-4 py-2.5 bg-[#5683da] hover:bg-[#6f98ee] rounded-full text-white transition-colors duration-300 cursor-pointer flex items-center justify-center" aria-label="Subscribe">
                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#4a4b50] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#95979e]">© 2026 IdeaForge. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-[#95979e]">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
