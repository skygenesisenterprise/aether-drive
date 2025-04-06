import { Github, Instagram } from "lucide-react";
import { FaDiscord, FaTwitter, FaMastodon } from "react-icons/fa";
import { cn } from "../utils/cn";

const FooterLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <a
    href={href}
    className={cn(
      "text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200",
      className
    )}
  >
    {children}
  </a>
);

const SocialIcon = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200",
      className
    )}
  >
    {children}
  </a>
);

const LanguageSelector = () => (
  <select className="bg-transparent text-sm text-gray-500 dark:text-gray-400 outline-none border-none cursor-pointer">
    <option value="en">English</option>
    <option value="fr">Français</option>
    <option value="de">Deutsch</option>
    <option value="es">Español</option>
    <option value="ja">日本語</option>
  </select>
);

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Aether Drive</span>
            </a>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Securely store, share, and manage your data with total privacy.
              Aether Drive is built by Sky Genesis Enterprise.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h3>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/docs">Documentation</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/help">Help Center</FooterLink>
                <FooterLink href="/status">Status</FooterLink>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Connect</h3>
              <div className="flex flex-col space-y-2">
                <FooterLink href="/newsletter">Newsletter</FooterLink>
                <FooterLink href="/community">Community</FooterLink>
                <FooterLink href="/partners">Partners</FooterLink>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Sky Genesis Enterprise. All rights reserved.
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <SocialIcon href="https://discord.com">
              <FaDiscord size={20} />
            </SocialIcon>
            <SocialIcon href="https://github.com">
              <Github size={20} />
            </SocialIcon>
            <SocialIcon href="https://twitter.com">
              <FaTwitter size={20} />
            </SocialIcon>
            <SocialIcon href="https://mastodon.social">
              <FaMastodon size={20} />
            </SocialIcon>
            <SocialIcon href="https://instagram.com">
              <Instagram size={20} />
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
