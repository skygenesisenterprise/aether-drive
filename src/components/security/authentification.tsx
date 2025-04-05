import React, { useState } from 'react';

interface LoginLog {
  id: number;
  device: string;
  ip: string;
  location: string;
  time: string;
}

export default function Authentication() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([
    {
      id: 1,
      device: 'Chrome on Windows',
      ip: '192.168.1.1',
      location: 'New York, USA',
      time: '2025-04-05 14:32',
    },
    {
      id: 2,
      device: 'Firefox on MacOS',
      ip: '192.168.1.2',
      location: 'San Francisco, USA',
      time: '2025-04-04 10:15',
    },
    {
      id: 3,
      device: 'Safari on iPhone',
      ip: '192.168.1.3',
      location: 'London, UK',
      time: '2025-04-03 08:45',
    },
  ]);

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Authentication Settings
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage your authentication settings, enable two-factor authentication, and review login logs.
      </p>

      {/* Two-Factor Authentication */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Two-Factor Authentication (2FA)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enhance your account security by enabling two-factor authentication.
        </p>
        <button
          onClick={toggle2FA}
          className={`rounded-lg px-4 py-2 font-medium ${
            is2FAEnabled
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-primary text-white hover:bg-primary-dark'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            is2FAEnabled ? 'focus:ring-red-600' : 'focus:ring-primary'
          }`}
        >
          {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
        {is2FAEnabled && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            Two-factor authentication is enabled for your account.
          </p>
        )}
      </div>

      {/* Login Logs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Login Logs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Review the devices and locations where your account has been accessed.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Device
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  IP Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loginLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {log.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {log.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}