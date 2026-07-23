import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FiSearch, FiShoppingCart, FiCalendar, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../axios';

const AdminOrders = () => {
  const axiosPrivate = useAxiosPrivate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get('/api/orders/admin');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Fetch admin orders error:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, updates) => {
    try {
      setUpdatingOrderId(orderId);
      const { data } = await axiosPrivate.put(`/api/orders/admin/status/${orderId}`, updates);
      
      // Update local state
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...data.order } : o));
    } catch (err) {
      console.error('Update status error:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    const orderIdShort = order._id.substring(order._id.length - 8).toUpperCase();
    const customerName = order.user?.name || '';
    const customerEmail = order.user?.email || '';
    const productName = order.orderItems?.product?.name || '';
    const q = searchQuery.toLowerCase();
    
    return orderIdShort.includes(q) ||
           customerName.toLowerCase().includes(q) ||
           customerEmail.toLowerCase().includes(q) ||
           productName.toLowerCase().includes(q);
  });

  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid' && o.deliveryStatus !== 'Cancelled' && o.deliveryStatus !== 'Returned')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 relative overflow-hidden text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#0e9f6e]">
            <FiShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Net Revenue (Paid)</p>
            <p className="text-2xl font-bold text-gray-800">Rs {totalRevenue}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <FiCalendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
            <p className="text-2xl font-bold text-gray-800">
              {orders.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Processing').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, or product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9f6e] focus:border-transparent text-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0e9f6e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center py-20 text-red-500">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg font-semibold">No orders found</p>
            <p className="text-sm text-gray-400">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[18%]">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">Product details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[14%]">Payment Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[14%]">Delivery Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredOrders.map((order) => {
                  const product = order.orderItems?.product;
                  const quantity = order.orderItems?.quantity || 1;
                  const isUpdating = updatingOrderId === order._id;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Order ID */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-gray-900">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{order.user?.name || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{order.user?.email || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Product Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                            {product?.images?.[0] ? (
                              <img 
                                src={getImageUrl(product.images[0])} 
                                alt={product.name} 
                                className="w-full h-full object-contain max-h-[36px]"
                              />
                            ) : (
                              <span className="text-lg">🧪</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate" title={product?.name}>
                              {product?.name || 'Product'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: <span className="font-bold">{quantity}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        Rs {order.totalPrice}
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <select
                            value={order.paymentStatus}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order._id, { paymentStatus: e.target.value })}
                            className={`text-xs font-semibold p-1.5 rounded border outline-none bg-white cursor-pointer transition-all ${
                              order.paymentStatus === 'Paid' ? 'text-emerald-700 border-emerald-200 bg-emerald-50/30' :
                              order.paymentStatus === 'Failed' ? 'text-rose-700 border-rose-200 bg-rose-50/30' :
                              'text-amber-700 border-amber-200 bg-amber-50/30'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </div>
                      </td>

                      {/* Delivery Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <select
                            value={order.deliveryStatus}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(order._id, { deliveryStatus: e.target.value })}
                            className={`text-xs font-semibold p-1.5 rounded border outline-none bg-white cursor-pointer transition-all ${
                              order.deliveryStatus === 'Delivered' ? 'text-emerald-700 border-emerald-200 bg-emerald-50/30' :
                              order.deliveryStatus === 'Cancelled' ? 'text-rose-700 border-rose-200 bg-rose-50/30' :
                              order.deliveryStatus === 'Processing' ? 'text-sky-700 border-sky-200 bg-sky-50/30' :
                              order.deliveryStatus === 'Shipped' ? 'text-indigo-700 border-indigo-200 bg-indigo-50/30' :
                              order.deliveryStatus === 'Out for Delivery' ? 'text-cyan-700 border-cyan-200 bg-cyan-50/30' :
                              order.deliveryStatus === 'Returned' ? 'text-gray-700 border-gray-200 bg-gray-50/30' :
                              'text-amber-700 border-amber-200 bg-amber-50/30'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Returned">Returned</option>
                            <option value="Failed Delivery">Failed Delivery</option>
                          </select>
                          {isUpdating && (
                            <div className="ml-2 w-3.5 h-3.5 border-2 border-[#0e9f6e] border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                      </td>
                      {/* Action Show Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-xs transition-colors"
                        >
                          Show Details
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

      {/* Selected Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 border border-gray-100 relative animate-fade-in text-left">
            <button 
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Details</h2>
            <p className="font-mono text-xs text-[#0e9f6e] font-bold mb-6">Order ID: {selectedOrderDetails._id.toUpperCase()}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Customer & Shipping Address */}
              <div>
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Customer Details</h3>
                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs space-y-1">
                  <p className="font-bold text-gray-800">{selectedOrderDetails.user?.name || 'N/A'}</p>
                  <p className="text-gray-600">Email: {selectedOrderDetails.user?.email || 'N/A'}</p>
                  <p className="text-gray-600">Role: <span className="uppercase font-semibold text-gray-700">{selectedOrderDetails.user?.role || 'user'}</span></p>
                </div>

                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs space-y-1">
                  <p className="font-bold text-gray-800">{selectedOrderDetails.shippingAddress?.fullName || 'N/A'}</p>
                  <p className="text-gray-700">Phone: {selectedOrderDetails.shippingAddress?.phone || 'N/A'}</p>
                  <p className="text-gray-600">Address: {selectedOrderDetails.shippingAddress?.street || 'N/A'}</p>
                  <p className="text-gray-600">City/State: {selectedOrderDetails.shippingAddress?.city || 'N/A'}, {selectedOrderDetails.shippingAddress?.state || 'N/A'}</p>
                  <p className="text-gray-600">Pincode: {selectedOrderDetails.shippingAddress?.pincode || 'N/A'}</p>
                  {selectedOrderDetails.shippingAddress?.landmark && (
                    <p className="text-gray-500 italic">Landmark: {selectedOrderDetails.shippingAddress.landmark}</p>
                  )}
                </div>
              </div>

              {/* Column 2: Product details, financials, and timestamps */}
              <div>
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Product & Order Summary</h3>
                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs space-y-2">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {selectedOrderDetails.orderItems?.product?.images?.[0] ? (
                        <img 
                          src={getImageUrl(selectedOrderDetails.orderItems.product.images[0])} 
                          alt={selectedOrderDetails.orderItems.product.name} 
                          className="w-full h-full object-contain max-h-[40px]"
                        />
                      ) : (
                        <span>🧪</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-800 truncate" title={selectedOrderDetails.orderItems?.product?.name}>
                        {selectedOrderDetails.orderItems?.product?.name || 'Product Name'}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        Qty: {selectedOrderDetails.orderItems?.quantity} × Rs {selectedOrderDetails.totalPrice / (selectedOrderDetails.orderItems?.quantity || 1)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-[#063344]">
                    <span>Total Price:</span>
                    <span>Rs {selectedOrderDetails.totalPrice}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Payment Method: <span className="uppercase font-semibold text-gray-700">{selectedOrderDetails.paymentMethod}</span></p>
                </div>

                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Order Timestamps</h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs space-y-1.5">
                  <p><span className="font-semibold text-gray-600">Created:</span> {new Date(selectedOrderDetails.createdAt).toLocaleString()}</p>
                  {selectedOrderDetails.paidAt && (
                    <p><span className="font-semibold text-emerald-700">Paid At:</span> {new Date(selectedOrderDetails.paidAt).toLocaleString()}</p>
                  )}
                  {selectedOrderDetails.deliveredAt && (
                    <p><span className="font-semibold text-emerald-700">Delivered At:</span> {new Date(selectedOrderDetails.deliveredAt).toLocaleString()}</p>
                  )}
                  {selectedOrderDetails.isReturned && (
                    <div className="border-t border-gray-200 pt-1.5 mt-1.5 text-rose-800 space-y-1">
                      <p className="font-semibold">↩ Return Information:</p>
                      <p>Reason: {selectedOrderDetails.returnReason}</p>
                      <p>Status: {selectedOrderDetails.returnStatus}</p>
                      {selectedOrderDetails.returnedAt && (
                        <p>Returned At: {new Date(selectedOrderDetails.returnedAt).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 bg-[#0e9f6e] hover:bg-[#0c8a5e] text-white font-bold rounded-lg text-sm shadow-sm transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
