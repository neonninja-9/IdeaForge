'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, ChevronRight, FolderKanban, LayoutGrid, Lightbulb, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

import ideaService from '@/services/ideaService';

interface SearchResult {
  label: string;
  description: string;
  href: string;
  isNoResult?: boolean;
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
  const [results, setResults] = useState<SearchResult[]>([
    {
      label: 'Search community ideas',
      description: 'Find ideas by title, problem, or tag',
      href: '/explore',
    }
  ]);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isActive = isHovered || isFocused;

  useEffect(() => {
    if (focusSignal > 0) {
      setIsFocused(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [focusSignal]);

  useEffect(() => {
    const defaultFallback = [
      {
        label: 'Search community ideas',
        description: 'Find ideas by title, problem, or tag',
        href: '/explore',
      }
    ];

    if (!query.trim()) {
      setResults(defaultFallback);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const response = await ideaService.searchIdeas(query, { signal: abortController.signal });
        if (response.data && response.data.length > 0) {
          setResults(response.data.map(item => ({
            label: item.title,
            description: item.problem || item.category || 'Idea Forge',
            href: `/idea/${item.id}`,
          })));
        } else {
          setResults([
            {
              label: 'No results found',
              description: `We couldn't find any ideas for "${query}"`,
              href: `/explore?q=${encodeURIComponent(query)}`,
              isNoResult: true,
            }
          ]);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Spotlight search error:', err);
          setResults(defaultFallback);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [query]);

  const search = () => {
    onSubmitSearch?.(query);
  };

  const shortcuts = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { label: 'Ideas', href: '/explore', icon: Lightbulb },
    { label: 'AI Studio', href: '/ai-studio', icon: Bot },
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
            "rounded-full border border-slate-200/80 bg-white text-slate-950 shadow-sm transition-colors focus-within:border-[#A16207] focus-within:ring-4 focus-within:ring-[#FEF3C7] dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus-within:border-[#A16207] dark:focus-within:ring-[#A16207]/30",
            !isActive && "cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10"
          )}
          onClick={() => {
            if (!isActive) {
              inputRef.current?.focus();
            }
          }}
        >
          <div className="flex h-11 items-center px-3">
            <Search className="size-5 shrink-0 text-slate-500 dark:text-slate-400" strokeWidth={1.8} aria-hidden="true" />
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
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-white/10 dark:bg-white/10 dark:text-slate-400 lg:inline-flex">⌘K</kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

          <AnimatePresence initial={false}>
            {isActive && query && (
              <div className="absolute left-0 top-full pt-2 z-50 w-full">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex w-full flex-col gap-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#1a1721]/80 dark:backdrop-blur-xl dark:shadow-black/50"
                >
                  {results.map((res, index) => (
                    <Link
                      key={res.href || index}
                      to={res.href}
                      onClick={search}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50 dark:hover:bg-white/10 group"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-600 shadow-sm border border-slate-100 group-hover:bg-white transition-colors dark:bg-white/5 dark:text-slate-300 dark:border-white/5 dark:group-hover:bg-white/10">
                        <Search className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-slate-900 dark:text-white truncate">{res.label}</span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{res.description}</span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-slate-400 dark:text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  ))}
                </motion.div>
              </div>
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
                className="grid h-11 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:bg-[#A16207] hover:text-white hover:shadow-md dark:bg-white/5 dark:text-slate-400 dark:ring-white/10 dark:hover:bg-[#A16207] dark:hover:text-white"
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
