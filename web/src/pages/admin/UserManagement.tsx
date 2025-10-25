import React from 'react';

const UserManagement: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">User Management</h1>
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
        <h2 className="text-xl font-bold mb-2">Manage Users</h2>
        <p className="text-gray-600">
          This is the user management page. Here you can view, add, edit, and delete users.
        </p>
      </div>
    </div>
  );
};

export default UserManagement;