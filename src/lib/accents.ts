export type AccentKey = 'pine' | 'clay' | 'ochre' | 'slate' | 'teal' | 'plum';

export interface Accent {
  /** Resting left-rule colour (Tailwind classes) */
  bar: string;
  /** Resting icon tile background (Tailwind classes) */
  tile: string;
  /** Resting icon colour (Tailwind classes) */
  icon: string;
  /** Solid hover fill colour, per theme (hex) */
  fill: { light: string; dark: string };
  /** Foreground colour that contrasts with the fill, per theme (hex) */
  on: { light: string; dark: string };
}

/**
 * A restrained, earthy palette. Resting state uses Tailwind classes; the hover
 * flood-fill is applied via CSS variables (see `.stat-card` in index.css) so it
 * works deterministically and stays theme-aware.
 */
export const ACCENTS: Record<AccentKey, Accent> = {
  pine: {
    bar: 'bg-emerald-800 dark:bg-emerald-500',
    tile: 'bg-emerald-800/10 dark:bg-emerald-400/10',
    icon: 'text-emerald-800 dark:text-emerald-300',
    fill: { light: '#065f46', dark: '#10b981' },
    on: { light: '#ffffff', dark: '#022c22' },
  },
  clay: {
    bar: 'bg-orange-700 dark:bg-orange-500',
    tile: 'bg-orange-700/10 dark:bg-orange-400/10',
    icon: 'text-orange-700 dark:text-orange-300',
    fill: { light: '#c2410c', dark: '#f97316' },
    on: { light: '#ffffff', dark: '#431407' },
  },
  ochre: {
    bar: 'bg-amber-600 dark:bg-amber-400',
    tile: 'bg-amber-600/10 dark:bg-amber-400/10',
    icon: 'text-amber-700 dark:text-amber-300',
    fill: { light: '#d97706', dark: '#fbbf24' },
    on: { light: '#ffffff', dark: '#451a03' },
  },
  slate: {
    bar: 'bg-slate-600 dark:bg-slate-400',
    tile: 'bg-slate-600/10 dark:bg-slate-400/10',
    icon: 'text-slate-700 dark:text-slate-300',
    fill: { light: '#475569', dark: '#94a3b8' },
    on: { light: '#ffffff', dark: '#0f172a' },
  },
  teal: {
    bar: 'bg-teal-700 dark:bg-teal-400',
    tile: 'bg-teal-700/10 dark:bg-teal-400/10',
    icon: 'text-teal-700 dark:text-teal-300',
    fill: { light: '#0f766e', dark: '#2dd4bf' },
    on: { light: '#ffffff', dark: '#042f2e' },
  },
  plum: {
    bar: 'bg-rose-800 dark:bg-rose-400',
    tile: 'bg-rose-800/10 dark:bg-rose-400/10',
    icon: 'text-rose-800 dark:text-rose-300',
    fill: { light: '#9f1239', dark: '#fb7185' },
    on: { light: '#ffffff', dark: '#4c0519' },
  },
};
