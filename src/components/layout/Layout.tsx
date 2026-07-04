import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { PageTransition } from './PageTransition';

export function Layout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Keying PageTransition by pathname remounts it on every navigation so
            the enter animation replays. We deliberately avoid AnimatePresence
            `mode="wait"` here: with the data-router <Outlet/> it can hold the
            exiting page and leave the incoming one stuck invisible (blank page
            until refresh). A plain keyed remount always renders fresh. */}
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
