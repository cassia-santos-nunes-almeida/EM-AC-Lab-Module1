import { cn } from '@/utils/cn';

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
}

/** Jump-to-section pill navigation */
export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  return (
    <nav className="flex flex-wrap gap-2 mb-6" aria-label="Table of contents">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
            activeId === item.id
              ? 'bg-engineering-blue-600 text-white border-engineering-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-engineering-blue-300 dark:hover:border-engineering-blue-600'
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
