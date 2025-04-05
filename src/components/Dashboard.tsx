import { FileExplorer } from './file-explorer/FileExplorer';
import {
  HardDrive,
  Star,
  Clock,
  Users,
  FileText,
  Image,
  Video,
  Archive,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { getRecentFiles, type FileItem } from '../lib/data';
import { cn, formatFileSize, formatDate } from '../lib/utils';

interface DashboardCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  bgClass?: string;
  iconClass?: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  bgClass = 'bg-blue-50 dark:bg-blue-900/20',
  iconClass = 'text-blue-500',
  change,
  changeType = 'neutral',
}: DashboardCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
          {change && (
            <div className="mt-4 flex items-center">
              <span
                className={cn(
                  'inline-flex items-center text-xs font-medium',
                  changeType === 'increase' && 'text-green-500',
                  changeType === 'decrease' && 'text-red-500'
                )}
              >
                {changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : ''}
                {' '}
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', bgClass)}>
          <div className={cn('h-6 w-6', iconClass)}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

interface RecentFileProps {
  file: FileItem;
}

const RecentFile = ({ file }: RecentFileProps) => {
  const getFileIcon = () => {
    switch (file.type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-purple-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-red-500" />;
      case 'archive':
        return <Archive className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          {getFileIcon()}
        </div>
        <div>
          <h4 className="font-medium">{file.name}</h4>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {formatDate(file.modifiedAt)}
          </p>
        </div>
      </div>
      <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export function Dashboard() {
  const recentFiles = getRecentFiles(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome to Aether Drive</h1>
        <p className="mt-1 text-muted-foreground">
          Securely store, share, and collaborate on files in the cloud.
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Storage Used"
          value="12.5 GB"
          description="Out of 25 GB"
          icon={<HardDrive />}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
          iconClass="text-blue-500"
          change="2.5 GB since last month"
          changeType="increase"
        />
        <DashboardCard
          title="Shared Files"
          value="47"
          description="12 recently shared"
          icon={<Users />}
          bgClass="bg-purple-50 dark:bg-purple-900/20"
          iconClass="text-purple-500"
          change="8 new shares"
          changeType="increase"
        />
        <DashboardCard
          title="Starred Items"
          value="18"
          description="Files and folders"
          icon={<Star />}
          bgClass="bg-amber-50 dark:bg-amber-900/20"
          iconClass="text-amber-500"
        />
        <DashboardCard
          title="Recent Activity"
          value="192"
          description="In the last 30 days"
          icon={<Clock />}
          bgClass="bg-green-50 dark:bg-green-900/20"
          iconClass="text-green-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent files section */}
        <div className="col-span-2 rounded-2xl border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-medium">Recent Files</h2>
            <button className="text-sm font-medium text-primary">View All</button>
          </div>
          <div className="p-6">
            <div className="divide-y">
              {recentFiles.map((file) => (
                <RecentFile key={file.id} file={file} />
              ))}
            </div>
          </div>
        </div>

        {/* Storage distribution section */}
        <div className="rounded-2xl border bg-background shadow-sm">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-medium">Storage Distribution</h2>
            <button className="text-sm font-medium text-primary">Details</button>
          </div>
          <div className="p-6">
            <div className="mb-6 h-36 flex items-center justify-center">
              <BarChart3 className="h-32 w-32 text-muted-foreground/70" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Documents</span>
                </div>
                <span className="text-sm font-medium">7.2 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Images</span>
                </div>
                <span className="text-sm font-medium">2.8 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Videos</span>
                </div>
                <span className="text-sm font-medium">1.5 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span className="text-sm">Other</span>
                </div>
                <span className="text-sm font-medium">1.0 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick access section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Quick Access</h2>
          <button className="text-sm font-medium text-primary">View All</button>
        </div>
        <FileExplorer />
      </div>
    </div>
  );
}
