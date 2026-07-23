import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import { FiSearch, FiUsers, FiUserCheck, FiUserX, FiLock, FiUnlock, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const { getCustomers, toggleCustomerStatus } = UserService();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data.customers || []);
      setError(null);
    } catch (err) {
      console.error('Fetch customers error:', err);
      setError(err.response?.data?.message || 'Failed to fetch customer list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customerId, currentStatus) => {
    const actionText = currentStatus ? 'block' : 'unblock';
    if (window.confirm(`Are you sure you want to ${actionText} this customer?`)) {
      try {
        setUpdatingId(customerId);
        await toggleCustomerStatus(customerId);
        
        // Update local state
        setCustomers(prev =>
          prev.map(c => c._id === customerId ? { ...c, status: !c.status } : c)
        );
        toast.success(`Customer successfully ${currentStatus ? 'blocked' : 'unblocked'}`);
      } catch (err) {
        console.error('Toggle status error:', err);
        toast.error(err.response?.data?.message || 'Failed to update customer status');
      } finally {
        setUpdatingId(null);
      }
    }
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const name = customer.name || '';
    const email = customer.email || '';
    const phone = customer.phone || '';
    const q = searchQuery.toLowerCase();
    
    return name.toLowerCase().includes(q) ||
           email.toLowerCase().includes(q) ||
           phone.toLowerCase().includes(q);
  });

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status !== false).length;
  const blockedCustomers = customers.filter(c => c.status === false).length;

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 relative overflow-hidden text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#0e9f6e]">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <FiUserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Accounts</p>
            <p className="text-2xl font-bold text-gray-800 text-blue-600">{activeCustomers}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <FiUserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Blocked Accounts</p>
            <p className="text-2xl font-bold text-gray-800 text-red-600">{blockedCustomers}</p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or phone number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9f6e] focus:border-transparent text-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0e9f6e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center py-20 text-red-500">
            {error}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-semibold">No customers found</p>
            <p className="text-sm text-gray-400">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Join Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">Customer Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Phone</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">DOB</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Gender</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[13%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredCustomers.map((customer) => {
                  const isUpdating = updatingId === customer._id;
                  const isActive = customer.status !== false;

                  return (
                    <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Join Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>
                            {new Date(customer.createdAt).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{customer.name}</span>
                          <span className="text-xs text-gray-500">{customer.email}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {customer.phone || '—'}
                      </td>

                      {/* DOB */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {customer.dob || '—'}
                      </td>

                      {/* Gender */}
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                        {customer.gender || '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(customer._id, isActive)}
                          disabled={isUpdating}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors focus:outline-none ${
                            isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-[#0e9f6e] hover:bg-green-100'
                          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isActive ? (
                            <>
                              <FiLock className="w-3.5 h-3.5" />
                              <span>Block</span>
                            </>
                          ) : (
                            <>
                              <FiUnlock className="w-3.5 h-3.5" />
                              <span>Unblock</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
