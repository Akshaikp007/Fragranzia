import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  FiGrid, 
  FiShoppingBag, 
  FiList, 
  FiUserCheck, 
  FiShoppingCart,
  FiLogOut,
  FiX
} from 'react-icons/fi';

const AdminSidebar = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Dashboard', icon: FiGrid, path: '/admin/dashboard' },
    { name: 'Products', icon: FiShoppingBag, path: '/admin/products' },
    { name: 'Categories', icon: FiList, path: '/admin/categories' },
    { name: 'Customers', icon: FiUserCheck, path: '/admin/customers' },
    { name: 'Orders', icon: FiShoppingCart, path: '/admin/orders' },
  ];

  return (
    <aside className="w-[260px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo & Close Button */}
      <div className="h-[70px] flex items-center justify-between px-6 border-b border-gray-100">
        <h1 className="text-[#0e9f6e] text-2xl font-bold tracking-tight">Dashtar</h1>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'text-[#0e9f6e] bg-green-50/50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Log Out Button */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full bg-[#0e9f6e] hover:bg-[#0c8a5e] text-white px-4 py-3 rounded-lg transition-colors font-medium"
        >
          <FiLogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
