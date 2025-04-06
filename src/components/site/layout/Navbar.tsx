import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../utils/cn";

const NavItem = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <a
    href={href}
    className={cn(
      "text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200",
      className
    )}
  >
    {children}
  </a>
);

const LanguageSelector = () => (
  <select className="bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none border-none cursor-pointer">
    <option value="en">EN</option>
    <option value="fr">FR</option>
    <option value="de">DE</option>
    <option value="es">ES</option>
    <option value="ja">JA</option>
  </select>
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Aether Drive</span>
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem href="/">Home</NavItem>
            <NavItem href="#features">Features</NavItem>
            <NavItem href="#pricing">Pricing</NavItem>
            <NavItem href="/docs">Docs</NavItem>
          </nav>

          {/* Right side items for desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSelector />

            {/* Sign In button */}
            <a
              href="auth/SignIn"
              className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 dark:border-indigo-500 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Sign In
            </a>

            {/* Sign Up button */}
            <a
              href="auth/SignUp"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Home</a>
          <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Features</a>
          <a href="#pricing" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</a>
          <a href="/docs" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Docs</a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4">
            <LanguageSelector />
          </div>
          <div className="mt-3 px-4 grid grid-cols-2 gap-2">
            <a
              href="/signin"
              className="block text-center px-4 py-2 border border-indigo-600 dark:border-indigo-500 text-base font-medium rounded-md text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
