import React, { useState } from 'react';

interface Device {
  id: number;
  name: string;
  ip: string;
  location: string;
  lastActive: string;
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: 'Chrome on Windows',
      ip: '192.168.1.1',
      location: 'New York, USA',
      lastActive: '2025-04-05 14:32',
    },
    {
      id: 2,
      name: 'Firefox on MacOS',
      ip: '192.168.1.2',
      location: 'San Francisco, USA',
      lastActive: '2025-04-04 10:15',
    },
    {
      id: 3,
      name: 'Safari on iPhone',
      ip: '192.168.1.3',
      location: 'London, UK',
      lastActive: '2025-04-03 08:45',
    },
  ]);

  const handleDisconnect = (id: number) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Connected Devices
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Review the devices currently connected to your account. You can disconnect any device you don't recognize.
      </p>

      {/* Devices List */}
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
                Last Active
              </th>
              <th scope="col" className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {devices.map((device) => (
              <tr key={device.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {device.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {device.ip}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {device.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {device.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleDisconnect(device.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                  >
                    Disconnect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}