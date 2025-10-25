import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Virtual Trading Platform</h2>
        <p className="text-gray-600">
          This is the home page of the virtual trading platform. You can navigate to different sections using the menu.
        </p>
      </div>
    </div>
  );
};

export default Home;