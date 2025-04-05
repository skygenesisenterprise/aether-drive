import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  Home,
  Star,
  Clock,
  HardDrive,
  Share2,
  Trash2,
  Settings,
  FileText,
  Image,
  Video,
  File,
  Archive,
  ChevronRight,
  LayoutGrid,
  Lock,
  Key,
  Shield,
  Smartphone,
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  href,
  icon,
  text,
  active = false,
  expanded = true,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
        'hover:bg-accent/10 dark:hover:bg-accent/20',
        active
          ? 'bg-accent/10 text-accent-foreground dark:bg-accent/20'
          : 'text-foreground/70 hover:text-foreground',
        !expanded && 'justify-center py-2 px-2'
      )}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        {icon}
      </div>
      {expanded && <span>{text}</span>}
    </Link>
  );
};

interface SidebarStorageProps {
  expanded: boolean;
}

const SidebarStorage = ({ expanded }: SidebarStorageProps) => {
  return (
    <div className={cn('px-3 py-2', !expanded && 'px-2')}>
      <div className="mb-2 flex items-center justify-between">
        {expanded && <p className="text-xs font-semibold">STORAGE</p>}
        {expanded && (
          <div className="h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center cursor-pointer">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className={cn('space-y-2', !expanded && 'flex justify-center')}>
          {expanded ? (
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-1/2 bg-primary rounded-full" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted overflow-hidden flex items-center justify-center text-xs font-medium text-primary-foreground">
              <span>50%</span>
            </div>
          )}
          {expanded && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">12.5 GB</span>
              <span className="font-medium">25 GB</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('/');

  const handleNavigation = (path: string) => {
    setActiveItem(path);
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out',
        expanded ? 'w-60' : 'w-16'
      )}
    >
      {/* Header (Logo) */}
      <div className="flex h-14 items-center px-4">
        <div
          className={cn(
            'flex items-center gap-2',
            !expanded && 'justify-center w-full'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <HardDrive className="h-4 w-4 text-primary-foreground" />
          </div>
          {expanded && (
            <span className="text-lg font-semibold">Aether Drive</span>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-hidden">
        <nav className="grid gap-1 px-2">
          <SidebarItem
            href="/"
            icon={<Home className="h-4 w-4" />}
            text="Dashboard"
            active={activeItem === '/'}
            expanded={expanded}
            onClick={() => handleNavigation('/')}
          />
          <SidebarItem
            href="/files"
            icon={<LayoutGrid className="h-4 w-4" />}
            text="My Files"
            active={activeItem === '/files'}
            expanded={expanded}
            onClick={() => handleNavigation('/files')}
          />
          <SidebarItem
            href="/starred"
            icon={<Star className="h-4 w-4" />}
            text="Starred"
            active={activeItem === '/starred'}
            expanded={expanded}
            onClick={() => handleNavigation('/starred')}
          />
          <SidebarItem
            href="/recent"
            icon={<Clock className="h-4 w-4" />}
            text="Recent"
            active={activeItem === '/recent'}
            expanded={expanded}
            onClick={() => handleNavigation('/recent')}
          />
          <SidebarItem
            href="/shared"
            icon={<Share2 className="h-4 w-4" />}
            text="Shared"
            active={activeItem === '/shared'}
            expanded={expanded}
            onClick={() => handleNavigation('/shared')}
          />
          <SidebarItem
            href="/trash"
            icon={<Trash2 className="h-4 w-4" />}
            text="Trash"
            active={activeItem === '/trash'}
            expanded={expanded}
            onClick={() => handleNavigation('/trash')}
          />
        </nav>

        {/* File Types */}
        <div className="mt-6">
          <div className={cn('mb-2 px-4', !expanded && 'px-2')}>
            {expanded && (
              <p className="text-xs font-semibold text-muted-foreground">FILE TYPES</p>
            )}
          </div>
          <nav className="grid gap-1 px-2">
            <SidebarItem
              href="/files/documents"
              icon={<FileText className="h-4 w-4" />}
              text="Documents"
              active={activeItem === '/files/documents'}
              expanded={expanded}
              onClick={() => handleNavigation('/files/documents')}
            />
            <SidebarItem
              href="/files/images"
              icon={<Image className="h-4 w-4" />}
              text="Images"
              active={activeItem === '/files/images'}
              expanded={expanded}
              onClick={() => handleNavigation('/files/images')}
            />
            <SidebarItem
              href="/files/videos"
              icon={<Video className="h-4 w-4" />}
              text="Videos"
              active={activeItem === '/files/videos'}
              expanded={expanded}
              onClick={() => handleNavigation('/files/videos')}
            />
            <SidebarItem
              href="/files/archives"
              icon={<Archive className="h-4 w-4" />}
              text="Archives"
              active={activeItem === '/files/archives'}
              expanded={expanded}
              onClick={() => handleNavigation('/files/archives')}
            />
            <SidebarItem
              href="/files/other"
              icon={<File className="h-4 w-4" />}
              text="Other Files"
              active={activeItem === '/files/other'}
              expanded={expanded}
              onClick={() => handleNavigation('/files/other')}
            />
          </nav>
        </div>

        {/* Security */}
        <div className="mt-6">
          <div className={cn('mb-2 px-4', !expanded && 'px-2')}>
            {expanded && (
              <p className="text-xs font-semibold text-muted-foreground">SECURITY</p>
            )}
          </div>
          <nav className="grid gap-1 px-2">
            <SidebarItem
              href="/security/account-activity"
              icon={<Clock className="h-4 w-4" />}
              text="Account Activity"
              active={activeItem === '/security/account-activity'}
              expanded={expanded}
              onClick={() => handleNavigation('/security/account-activity')}
            />
            <SidebarItem
              href="/security/authentication"
              icon={<Lock className="h-4 w-4" />}
              text="Authentication"
              active={activeItem === '/security/authentication'}
              expanded={expanded}
              onClick={() => handleNavigation('/security/authentication')}
            />
            <SidebarItem
              href="/security/vault"
              icon={<Shield className="h-4 w-4" />}
              text="Vault"
              active={activeItem === '/security/vault'}
              expanded={expanded}
              onClick={() => handleNavigation('/security/vault')}
            />
            <SidebarItem
              href="/security/devices"
              icon={<Smartphone className="h-4 w-4" />}
              text="Devices"
              active={activeItem === '/security/devices'}
              expanded={expanded}
              onClick={() => handleNavigation('/security/devices')}
            />
          </nav>
        </div>
      </div>

      {/* Footer sections */}
      <div className="mt-auto">
        {/* Storage */}
        <div className="border-t">
          <SidebarStorage expanded={expanded} />
        </div>

        {/* Settings et Toggle button */}
        <div className="border-t flex items-center justify-between px-2 py-2">
          {/* Settings */}
          <SidebarItem
            href="/settings"
            icon={<Settings className="h-4 w-4" />}
            text="Settings"
            active={activeItem === '/settings'}
            expanded={expanded}
            onClick={() => handleNavigation('/settings')}
          />

          {/* Toggle button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-muted"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                expanded ? "rotate-180" : ""
              )}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
