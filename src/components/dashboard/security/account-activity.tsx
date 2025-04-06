import React from 'react';

import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';

export default function AccountActivity() {
  // Exemple de données fictives pour l'activité du compte
  const activityData = [
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
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Account Activity
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Review your recent account activity to ensure your account is secure.
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
            {activityData.map((activity) => (
              <tr key={activity.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {activity.device}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {activity.ip}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {activity.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {activity.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}