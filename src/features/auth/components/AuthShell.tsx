import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Tag, Truck } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Sparkles, label: 'Curated premium collections' },
  { icon: Tag, label: 'Members-only deals & coupons' },
  { icon: Truck, label: 'Fast, reliable delivery' },
];

/**
 * Split-screen auth layout: a colorful brand panel on the left (hidden on small
 * screens) and the form on a clean panel on the right. The brand panel carries
 * the glassmorphism/gradient treatment so the whole screen feels premium.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-12 text-white lg:flex">
        {/* drifting blobs for depth */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/15 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-accent-300/25 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />

        <div className="relative z-10">
          <span className="text-2xl font-bold tracking-tight">Sed_Ecomm</span>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold leading-tight tracking-tight"
          >
            Premium shopping,
            <br />
            thoughtfully designed.
          </motion.h2>
          <p className="mt-4 text-white/80">
            Discover curated products, exclusive deals, and a seamless checkout — all in one place.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-white/90">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                  <Icon className="size-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-white/60">© 2026 Sed_Ecomm. All rights reserved.</div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-background px-4 py-12 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
