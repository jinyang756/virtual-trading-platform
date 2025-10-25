import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Admin Dashboard</h1>
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
        <h2 className="text-xl font-bold mb-2">System Overview</h2>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Here you can manage users, monitor system performance, and configure platform settings.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;