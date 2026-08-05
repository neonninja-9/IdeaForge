'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, FolderKanban, LayoutGrid, Lightbulb, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

interface SearchResult {
  label: string;
  description: string;
  href: string;
}

export interface AppleSpotlightProps {
  /** Called when the user presses Enter in the search field. */
  onSubmitSearch?: (query: string) => void;
  /** Increment this value to focus the input, such as from a Cmd/Ctrl+K shortcut. */
  focusSignal?: number;
  className?: string;
}

export function AppleSpotlight({ onSubmitSearch, focusSignal = 0, className }: AppleSpotlightProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [resultHovered, setResultHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isActive = isHovered || isFocused;

  useEffect(() => {
    if (focusSignal > 0) {
      setIsFocused(true);
      inputRef.current?.focus();
    }
  }, [focusSignal]);

  const search = () => {
    onSubmitSearch?.(query);
  };

  const result: SearchResult = {
    label: 'Search community ideas',
    description: query ? `Search for “${query}”` : 'Find ideas by title, problem, or tag',
    href: `/explore?q=${encodeURIComponent(query)}`,
  };

  const shortcuts = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'Ideas', href: '/explore', icon: Lightbulb },
    { label: 'AI Studio (Soon)', href: '/ai-studio', icon: Bot },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <div
      className={cn('relative flex justify-start', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex min-w-0 items-center justify-start gap-2">
        <div className="relative flex justify-start min-w-0">
        <motion.div
          layout
          initial={false}
          animate={{ width: isActive ? 320 : 44 }}
          transition={{ layout: { duration: 0.35, type: 'spring', bounce: 0.15 }, width: { duration: 0.35, type: 'spring', bounce: 0.15 } }}
          className={cn(
            "rounded-full border border-slate-200/80 bg-white text-slate-950 shadow-sm transition-colors focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50",
            !isActive && "cursor-pointer hover:bg-slate-50"
          )}
          onClick={() => {
            if (!isActive) {
              inputRef.current?.focus();
            }
          }}
        >
          <div className="flex h-11 items-center px-3">
            <Search className="size-5 shrink-0 text-slate-500" strokeWidth={1.8} aria-hidden="true" />
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-1 items-center gap-2 ml-3 overflow-hidden whitespace-nowrap"
                >
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') search();
                      if (event.key === 'Escape') {
                        setIsFocused(false);
                        inputRef.current?.blur();
                      }
                    }}
                    placeholder="Search community ideas..."
                    aria-label="Search community ideas"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                  <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:inline-flex">⌘K</kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

          <AnimatePresence initial={false}>
            {isActive && query && (
              <MotionLink
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -4 }}
                to={result.href}
                onMouseEnter={() => setResultHovered(true)}
                onMouseLeave={() => setResultHovered(false)}
                onClick={search}
                className="absolute left-0 top-[calc(100%+8px)] z-50 flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-xl shadow-slate-200/50 hover:bg-slate-50"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-white text-slate-600 shadow-sm">
                  <Search className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{result.label}</span>
                  <span className="block truncate text-xs text-slate-500">{result.description}</span>
                </span>
                <ChevronRight className={cn('size-5 text-slate-500 transition-opacity', resultHovered ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
              </MotionLink>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center">
          {shortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <MotionLink
                key={shortcut.label}
                to={shortcut.href}
                title={shortcut.label}
                aria-label={shortcut.label}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.65,
                  x: isActive ? 0 : -18,
                  width: isActive ? 44 : 0,
                  marginLeft: isActive && index > 0 ? 8 : 0
                }}
                transition={{ type: 'spring', stiffness: 480, damping: 28, delay: isActive ? index * 0.045 : 0 }}
                className="grid h-11 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:bg-indigo-600 hover:text-white hover:shadow-md"
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
              >
                <Icon className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
              </MotionLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
