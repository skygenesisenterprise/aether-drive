import React, { useState } from 'react';

interface Secret {
  id: number;
  name: string;
  value: string;
  createdAt: string;
}

export default function Vault() {
  const [secrets, setSecrets] = useState<Secret[]>([
    {
      id: 1,
      name: 'GitHub Token',
      value: 'ghp_1234567890abcdef',
      createdAt: '2025-04-01 10:00',
    },
    {
      id: 2,
      name: 'AWS Access Key',
      value: 'AKIAIOSFODNN7EXAMPLE',
      createdAt: '2025-03-28 15:30',
    },
  ]);
  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');

  const handleAddSecret = () => {
    if (newSecretName && newSecretValue) {
      const newSecret: Secret = {
        id: secrets.length + 1,
        name: newSecretName,
        value: newSecretValue,
        createdAt: new Date().toISOString(),
      };
      setSecrets([...secrets, newSecret]);
      setNewSecretName('');
      setNewSecretValue('');
    }
  };

  const handleDeleteSecret = (id: number) => {
    setSecrets(secrets.filter((secret) => secret.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Vault - Manage Your Secrets
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Store and manage your sensitive information securely.
      </p>

      {/* Add Secret Form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Add a New Secret
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Secret Name"
            value={newSecretName}
            onChange={(e) => setNewSecretName(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Secret Value"
            value={newSecretValue}
            onChange={(e) => setNewSecretValue(e.target.value)}
            className="flex-1 rounded-lg border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <button
            onClick={handleAddSecret}
            className="rounded-lg bg-primary px-4 py-2 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary dark:hover:bg-primary-dark"
          >
            Add
          </button>
        </div>
      </div>

      {/* Secrets List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {secrets.map((secret) => (
              <tr key={secret.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {secret.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {secret.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {secret.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleDeleteSecret(secret.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                  >
                    Delete
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