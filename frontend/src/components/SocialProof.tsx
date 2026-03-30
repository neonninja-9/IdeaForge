"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  { quote: "IdeaForge changed how we pitch. What used to take two weeks of chaotic brainstorming now takes 48 hours of focused 'forging'.", author: "Leo Vance", role: "Founder, NovaSpark Studio", initials: "LV" },
  { quote: "The versioned prototyping feature alone saved us thousands in wasted development. Game changer for product strategy.", author: "Maya Chen", role: "CTO, Archetype Labs", initials: "MC" },
];

const caseStudies = [
  { name: "Archetype Labs", description: "Streamlining biotech research communications through structured narrative forging.", stat: "3× faster research cycle" },
  { name: "Prism Tech", description: "Defining the next generation of VR interfaces using the forge capture canvas.", stat: "94% team approval" },
];

export default function SocialProof() {
  const [inView, setInView] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} id="proof" className="py-28 lg:py-36 px-6 lg:px-10 bg-surface-alt dot-grid">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-20 transition-all duration-700 ${inView ? "translate-y-0" : "translate-y-6"}`}>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-vivid mb-4">Proof of Work</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.02em] leading-[1.05] text-fg max-w-2xl">
            Empowering the world&apos;s most creative labs.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className={`flex gap-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-60 translate-y-4"}`} style={{ transitionDelay: "200ms" }}>
              <div>
                <p className="text-6xl font-black text-vivid tracking-tight">5×</p>
                <p className="text-[11px] text-fg-light mt-2 uppercase tracking-[0.15em] font-medium">Faster Delivery</p>
              </div>
              <div className="w-px bg-edge" />
              <div>
                <p className="text-6xl font-black text-fg tracking-tight">94%</p>
                <p className="text-[11px] text-fg-light mt-2 uppercase tracking-[0.15em] font-medium">Approval Rating</p>
              </div>
            </div>

            <div className={`relative transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-60 translate-y-4"}`} style={{ transitionDelay: "400ms" }}>
              <div className="relative overflow-hidden min-h-[180px]">
                {testimonials.map((t, i) => (
                  <div key={i} className={`absolute inset-0 transition-all duration-700 ${i === activeTestimonial ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                    <blockquote className="border-l-3 border-vivid pl-6">
                      <p className="text-lg italic text-fg leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                    </blockquote>
                    <div className="flex items-center gap-3 pl-6">
                      <div className="w-10 h-10 rounded-full bg-fg flex items-center justify-center text-white text-sm font-bold">{t.initials}</div>
                      <div>
                        <p className="text-sm font-semibold text-fg">{t.author}</p>
                        <p className="text-xs text-fg-light">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-6 pl-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeTestimonial ? "w-8 bg-vivid" : "w-3 bg-edge hover:bg-fg-light"}`} aria-label={`Testimonial ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {caseStudies.map((study, i) => (
              <div key={i} className={`group relative bg-white rounded-2xl border border-edge p-8 hover:shadow-xl transition-all duration-500 cursor-pointer ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`} style={{ transitionDelay: inView ? `${300 + i * 150}ms` : "0ms" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-alt border border-edge flex items-center justify-center group-hover:bg-vivid group-hover:border-vivid transition-all duration-500">
                    <div className="w-5 h-5 rounded bg-edge group-hover:bg-white/30 transition-colors duration-500" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-vivid font-medium">{study.stat}</span>
                </div>
                <h4 className="text-xl font-bold text-fg mb-2">{study.name}</h4>
                <p className="text-sm text-fg-mid leading-relaxed mb-5">{study.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-vivid group-hover:gap-3 transition-all duration-300">
                  Read Case Study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
