import { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={cn(
        'fixed inset-y-0 z-50 bg-background transition-transform duration-300 ease-in-out',
        'sm:relative sm:z-0 sm:translate-x-0',
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar />
      </div>

      {/* Backdrop for mobile navigation */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden"
          onClick={toggleMobileNav}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Header onMobileMenuToggle={toggleMobileNav} />
        <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
