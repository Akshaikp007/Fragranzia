import React from 'react';
import { FiUser, FiMenu } from 'react-icons/fi';

const AdminNavBar = ({ onMenuClick }) => {
  return (
    <header className="h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Admin Control Panel</h2>
      </div>
      
      <div className="flex items-center gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <FiUser className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 leading-tight">Admin User</span>
            <span className="text-xs text-gray-500 font-medium">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;
