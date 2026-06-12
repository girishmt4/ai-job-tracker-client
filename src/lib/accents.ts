export type AccentKey =
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'indigo'
  | 'fuchsia';

export interface Accent {
  /** Soft tinted card background */
  card: string;
  /** Gradient-filled icon badge */
  iconWrap: string;
  /** Solid accent text */
  text: string;
  /** Hover ring/border tint */
  ring: string;
}

export const ACCENTS: Record<AccentKey, Accent> = {
  violet: {
    card: 'bg-violet-50/70 dark:bg-violet-500/10',
    iconWrap: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
    text: 'text-violet-600 dark:text-violet-300',
    ring: 'hover:border-violet-400/60',
  },
  blue: {
    card: 'bg-blue-50/70 dark:bg-blue-500/10',
    iconWrap: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
    text: 'text-blue-600 dark:text-blue-300',
    ring: 'hover:border-blue-400/60',
  },
  emerald: {
    card: 'bg-emerald-50/70 dark:bg-emerald-500/10',
    iconWrap: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    text: 'text-emerald-600 dark:text-emerald-300',
    ring: 'hover:border-emerald-400/60',
  },
  amber: {
    card: 'bg-amber-50/70 dark:bg-amber-500/10',
    iconWrap: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
    text: 'text-amber-600 dark:text-amber-300',
    ring: 'hover:border-amber-400/60',
  },
  rose: {
    card: 'bg-rose-50/70 dark:bg-rose-500/10',
    iconWrap: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
    text: 'text-rose-600 dark:text-rose-300',
    ring: 'hover:border-rose-400/60',
  },
  cyan: {
    card: 'bg-cyan-50/70 dark:bg-cyan-500/10',
    iconWrap: 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white',
    text: 'text-cyan-600 dark:text-cyan-300',
    ring: 'hover:border-cyan-400/60',
  },
  indigo: {
    card: 'bg-indigo-50/70 dark:bg-indigo-500/10',
    iconWrap: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white',
    text: 'text-indigo-600 dark:text-indigo-300',
    ring: 'hover:border-indigo-400/60',
  },
  fuchsia: {
    card: 'bg-fuchsia-50/70 dark:bg-fuchsia-500/10',
    iconWrap: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white',
    text: 'text-fuchsia-600 dark:text-fuchsia-300',
    ring: 'hover:border-fuchsia-400/60',
  },
};
