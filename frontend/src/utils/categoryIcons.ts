import { Leaf, BookOpen, HeartPulse, Globe2, Landmark, Building2, Rocket, Lock, Users, Cpu, Wrench, Cloud, Link, ShoppingCart, Gamepad2, Hash } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const getCategoryIcon = (slug?: string): LucideIcon => {
  if (!slug) return Hash;
  const map: Record<string, LucideIcon> = {
    'agriculture': Leaf,
    'education': BookOpen,
    'healthcare': HeartPulse,
    'environment': Globe2,
    'finance': Landmark,
    'smart-cities': Building2,
    'transportation': Rocket,
    'cybersecurity': Lock,
    'social-impact': Users,
    'ai-ml': Cpu,
    'devtools': Wrench,
    'saas': Cloud,
    'web3': Link,
    'e-commerce': ShoppingCart,
    'entertainment': Gamepad2,
  };
  return map[slug] || Hash;
};
