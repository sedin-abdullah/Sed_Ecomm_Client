import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultKey?: string;
  className?: string;
}

export function Tabs({ items, defaultKey, className }: TabsProps) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key);
  const activeItem = items.find((item) => item.key === active) ?? items[0];

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={active === item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              'relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
              active === item.key ? 'text-brand-500' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
            {active === item.key && (
              <motion.div
                layoutId="tabs-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-500"
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={activeItem?.key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        role="tabpanel"
        className="py-5"
      >
        {activeItem?.content}
      </motion.div>
    </div>
  );
}
