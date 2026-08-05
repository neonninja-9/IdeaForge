"use client";

const modules = [
  "Team Planner",
  "Project Management",
  "AI Forge",
  "Chat",
  "Documents",
  "Inbox",
  "Knowledge Graph",
];

export default function TrustedBy() {
  return (
    <section className="border-t border-white/10 bg-[#090a0c] px-5 py-12 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-4 text-sm text-[#95979e]">
          Everything you need for productive idea work:
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {modules.map((module) => (
            <span key={module} className="text-sm font-semibold text-white">
              {module}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
