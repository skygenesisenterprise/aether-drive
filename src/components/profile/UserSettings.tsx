import { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Bell,
  Moon,
  Sun,
  Shield,
  Database,
  Download,
  Upload,
  Clock,
  CreditCard,
  LogOut,
  ChevronRight,
  Camera
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@skygenesis.com',
  avatar: null, // In a real app, this would be a URL to the user's avatar
  role: 'Admin',
  company: 'Sky Genesis Enterprise',
  createdAt: new Date('2023-04-15'),
  planType: 'Business Pro',
  storageUsed: 12.5 * 1024 * 1024 * 1024, // 12.5 GB in bytes
  storageLimit: 25 * 1024 * 1024 * 1024, // 25 GB in bytes
};

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, description, children }: SettingsSectionProps) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="rounded-xl border bg-card">{children}</div>
    </div>
  );
};

interface SettingsItemProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  hasDivider?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  description,
  children,
  onClick,
  hasDivider = true
}: SettingsItemProps) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between px-6 py-4",
        onClick && "cursor-pointer hover:bg-muted/50",
        hasDivider && "border-b"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div>
          <div className="font-medium">{title}</div>
          {description && <div className="mt-1 text-sm text-muted-foreground">{description}</div>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

// Toggle switch component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-muted"
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};

export function UserSettings() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(false);

  // Calculate storage percentage
  const storagePercentage = Math.round((mockUser.storageUsed / mockUser.storageLimit) * 100);

  // Format storage values
  const formatStorage = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile section */}
      <SettingsSection
        title="Profile"
        description="Manage your profile information"
      >
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              {mockUser.avatar ? (
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-muted-foreground">
                  {mockUser.name.charAt(0)}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-sm">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-semibold text-xl">{mockUser.name}</h3>
            <p className="text-sm text-muted-foreground">{mockUser.role} at {mockUser.company}</p>
            <p className="text-sm text-muted-foreground">{mockUser.planType} Plan</p>
          </div>
        </div>

        <SettingsItem
          icon={<User className="h-5 w-5" />}
          title="Name"
          description="Your full name"
        >
          <div className="flex w-full max-w-sm items-center space-x-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </SettingsItem>

        <SettingsItem
          icon={<Mail className="h-5 w-5" />}
          title="Email"
          description="Your email address"
        >
          <div className="flex w-full max-w-sm items-center space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </SettingsItem>

        <SettingsItem
          icon={<Lock className="h-5 w-5" />}
          title="Password"
          description="Update your password"
          hasDivider={false}
        >
          <button className="flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            Change
          </button>
        </SettingsItem>
      </SettingsSection>

      {/* Appearance section */}
      <SettingsSection
        title="Appearance"
        description="Customize the appearance of the application"
      >
        <SettingsItem
          icon={theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          title="Theme"
          description="Choose your preferred theme"
          hasDivider={false}
        >
          <button
            onClick={toggleTheme}
            className="flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </SettingsItem>
      </SettingsSection>

      {/* Security section */}
      <SettingsSection
        title="Security"
        description="Manage your account security"
      >
        <SettingsItem
          icon={<Shield className="h-5 w-5" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        >
          <ToggleSwitch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
        </SettingsItem>

        <SettingsItem
          icon={<Clock className="h-5 w-5" />}
          title="Account Activity"
          description="View your recent login activity"
          hasDivider={false}
        >
          <button className="flex items-center gap-1 text-sm text-primary">
            View
            <ChevronRight className="h-4 w-4" />
          </button>
        </SettingsItem>
      </SettingsSection>

      {/* Notifications section */}
      <SettingsSection
        title="Notifications"
        description="Manage your notification preferences"
      >
        <SettingsItem
          icon={<Bell className="h-5 w-5" />}
          title="Push Notifications"
          description="Receive notifications in the app"
        >
          <ToggleSwitch checked={notificationsEnabled} onChange={setNotificationsEnabled} />
        </SettingsItem>

        <SettingsItem
          icon={<Mail className="h-5 w-5" />}
          title="Email Notifications"
          description="Receive notifications via email"
          hasDivider={false}
        >
          <ToggleSwitch checked={emailNotificationsEnabled} onChange={setEmailNotificationsEnabled} />
        </SettingsItem>
      </SettingsSection>

      {/* Storage section */}
      <SettingsSection
        title="Storage"
        description="Manage your storage"
      >
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Used {formatStorage(mockUser.storageUsed)}</span>
              <span className="text-sm font-medium">Total {formatStorage(mockUser.storageLimit)}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {storagePercentage}% of your storage used
            </p>
          </div>
        </div>

        <SettingsItem
          icon={<Database className="h-5 w-5" />}
          title="Storage Usage"
          description="View detailed storage usage by file type"
        >
          <button className="flex items-center gap-1 text-sm text-primary">
            View
            <ChevronRight className="h-4 w-4" />
          </button>
        </SettingsItem>

        <SettingsItem
          icon={<CreditCard className="h-5 w-5" />}
          title="Upgrade Plan"
          description="Upgrade to get more storage space"
          hasDivider={false}
        >
          <button className="flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            Upgrade
          </button>
        </SettingsItem>
      </SettingsSection>

      {/* Privacy section */}
      <SettingsSection
        title="Privacy"
        description="Manage your privacy settings"
      >
        <SettingsItem
          icon={<User className="h-5 w-5" />}
          title="Public Profile"
          description="Allow others to find and view your profile"
        >
          <ToggleSwitch checked={publicProfileEnabled} onChange={setPublicProfileEnabled} />
        </SettingsItem>

        <SettingsItem
          icon={<Upload className="h-5 w-5" />}
          title="Offline Sync"
          description="Sync files when offline for later upload"
          hasDivider={false}
        >
          <ToggleSwitch checked={syncEnabled} onChange={setSyncEnabled} />
        </SettingsItem>
      </SettingsSection>

      {/* Sign out button */}
      <div className="mt-8 flex justify-center">
        <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
