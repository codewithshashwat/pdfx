import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-gradient-to-r bg-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 gap-2 flex items-center justify-center">
        <h1 className="text-5xl">PDF</h1>
        <img src="/logo.png" alt="" width={50} />
      </div>
    </nav>
  );
};

export default Navbar;
