import { useState } from 'react';
import { X, Search, Plus, User, Link, Copy, Check, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { FileItem, FolderItem } from '../../../lib/data';

// Mock users data
const mockUsers = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@skygenesis.com',
    avatar: null,
    role: 'Admin',
  },
  {
    id: 'user-2',
    name: 'Lee Park',
    email: 'lee.park@skygenesis.com',
    avatar: null,
    role: 'Developer',
  },
  {
    id: 'user-3',
    name: 'Jordan Smith',
    email: 'jordan.smith@skygenesis.com',
    avatar: null,
    role: 'Designer',
  },
  {
    id: 'user-4',
    name: 'Taylor Williams',
    email: 'taylor.williams@skygenesis.com',
    avatar: null,
    role: 'Manager',
  },
  {
    id: 'user-5',
    name: 'Morgan Brown',
    email: 'morgan.brown@skygenesis.com',
    avatar: null,
    role: 'Content Writer',
  },
];

type Permission = 'view' | 'edit' | 'admin';

interface SharedUser {
  id: string;
  permission: Permission;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem | FolderItem | null;
}

export function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    { id: 'user-2', permission: 'view' },
  ]);
  const [selectedPermission, setSelectedPermission] = useState<Permission>('view');
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [shareLink, setShareLink] = useState('');

  if (!isOpen || !item) return null;

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => {
    const isAlreadyShared = sharedUsers.some(sharedUser => sharedUser.id === user.id);
    if (isAlreadyShared) return false;

    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get shared user details
  const getSharedUserDetails = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  // Add user to shared list
  const addSharedUser = (userId: string) => {
    setSharedUsers([...sharedUsers, { id: userId, permission: selectedPermission }]);
    setSearchQuery('');
  };

  // Update user permission
  const updateUserPermission = (userId: string, permission: Permission) => {
    setSharedUsers(sharedUsers.map(user =>
      user.id === userId ? { ...user, permission } : user
    ));
  };

  // Remove user from shared list
  const removeSharedUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter(user => user.id !== userId));
  };

  // Generate shareable link
  const generateShareLink = () => {
    // In a real app, this would make an API call to generate a link
    const link = `https://aetherdrive.skygenesis.com/shared/${item.id}?token=${Math.random().toString(36).substring(2, 15)}`;
    setShareLink(link);
    setLinkGenerated(true);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="z-50 w-full max-w-md rounded-2xl border bg-background p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Share {item.name}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Add people */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium">People with access</h3>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Add people or groups"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />
          </div>

          {/* Search results */}
          {searchQuery && (
            <div className="mb-4 max-h-64 overflow-auto rounded-lg border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b p-3 last:border-b-0 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => addSharedUser(user.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  No users found
                </div>
              )}
            </div>
          )}

          {/* Shared users list */}
          <div className="max-h-64 overflow-auto rounded-lg border">
            {/* Owner */}
            <div className="flex items-center justify-between border-b p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xs font-medium">A</span>
                </div>
                <div>
                  <div className="font-medium">You (Alex Johnson)</div>
                  <div className="text-xs text-muted-foreground">alex.johnson@skygenesis.com</div>
                </div>
              </div>
              <div className="text-sm font-medium">Owner</div>
            </div>

            {/* Shared users */}
            {sharedUsers.map(sharedUser => {
              const user = getSharedUserDetails(sharedUser.id);
              if (!user) return null;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b p-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={sharedUser.permission}
                      onChange={(e) => updateUserPermission(user.id, e.target.value as Permission)}
                      className="h-8 rounded border bg-background px-2 text-xs"
                    >
                      <option value="view">Viewer</option>
                      <option value="edit">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => removeSharedUser(user.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate link */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium">Share via link</h3>

          {linkGenerated ? (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Anyone with the link</span>
                </div>
                <select
                  value={selectedPermission}
                  onChange={(e) => setSelectedPermission(e.target.value as Permission)}
                  className="h-8 rounded border bg-background px-2 text-xs"
                >
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                  <option value="admin">Admin access</option>
                </select>
              </div>
              <div className="flex items-center justify-between overflow-hidden rounded-lg border bg-background">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent px-3 py-2 text-xs outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 border-l bg-muted/20 px-3 py-2 text-xs font-medium hover:bg-muted"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={generateShareLink}
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-muted/30 p-3 hover:bg-muted/50"
            >
              <Link className="h-4 w-4" />
              <span className="text-sm font-medium">Generate shareable link</span>
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{sharedUsers.length} people with access</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
