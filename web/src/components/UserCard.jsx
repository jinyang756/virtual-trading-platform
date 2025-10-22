import React from 'react';

export function UserCard({ user }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded shadow">
      <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full" />
      <div>
        <h2 className="text-lg font-bold">{user.nickname}</h2>
        <p className="text-sm text-gray-500">{user.phone}</p>
      </div>
    </div>
  );
}

export default UserCard;