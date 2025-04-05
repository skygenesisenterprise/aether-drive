import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Search, Bell, Plus, ChevronDown, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  // Gestionnaires d'actions
  const handleNewFile = () => {
    console.log('New File action triggered');
    // Ajoutez ici la logique pour créer un nouveau fichier
    setIsDropdownOpen(false); // Fermer le menu après l'action
  };

  const handleNewFolder = () => {
    console.log('New Folder action triggered');
    // Ajoutez ici la logique pour créer un nouveau dossier
    setIsDropdownOpen(false); // Fermer le menu après l'action
  };

  const handleUpload = () => {
    console.log('Upload action triggered');
    // Ajoutez ici la logique pour télécharger un fichier
    setIsDropdownOpen(false); // Fermer le menu après l'action
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg border sm:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Search bar */}
      <div className="relative flex flex-1 items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search files and folders..."
          className="h-9 w-full rounded-lg border bg-background pl-8 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border">
          <Bell className="h-4 w-4" />
        </button>

        {/* Create Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex h-8 items-center gap-2 rounded-lg border px-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden text-xs font-medium sm:inline-block">Create</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {isDropdownOpen && (
            <div
              className={cn(
                "absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg z-50 dark:bg-gray-800",
                isDropdownOpen ? "dropdown-enter dropdown-enter-active" : "dropdown-exit dropdown-exit-active"
              )}
            >
              <ul className="py-1 text-sm">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                  onClick={handleNewFile}
                >
                  New File
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                  onClick={handleNewFolder}
                >
                  New Folder
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                  onClick={handleUpload}
                >
                  Upload
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2 rounded-lg border p-1 hover:bg-muted"
          >
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary">
              <span className="text-xs font-medium text-primary-foreground">SK</span>
            </div>
            <span className="hidden text-sm font-medium sm:inline-block">Sky Genesis Enterprise</span>
            <ChevronDown className="hidden h-3 w-3 sm:block" />
          </button>
          {isProfileDropdownOpen && (
            <div
              className={cn(
                "absolute top-full mt-1 w-48 rounded-lg border bg-white shadow-lg z-50 dark:bg-gray-800",
                isProfileDropdownOpen ? "dropdown-enter dropdown-enter-active" : "dropdown-exit dropdown-exit-active"
              )}
            >
              <ul className="py-1 text-sm">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => console.log('Profile clicked')}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => console.log('Settings clicked')}
                >
                  Settings
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => console.log('Logout clicked')}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
