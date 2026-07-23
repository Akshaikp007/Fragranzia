import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiBox, 
  FiUsers, 
  FiActivity, 
  FiArrowUpRight,
  FiRefreshCw
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { getDashboardStats } = UserService();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activePoint, setActivePoint] = useState(null);

  // Elegant colors for the Category Donut chart
  const donutColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#f59e0b", "#06b6d4", "#ec4899"];

  const fetchStats = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Fetch dashboard stats error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0e9f6e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center justify-between max-w-2xl mx-auto my-8">
        <div>
          <h3 className="font-bold text-sm">Error loading dashboard</h3>
          <p className="text-xs mt-1">{error}</p>
        </div>
        <button 
          onClick={() => fetchStats()} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate fields safely
  const totalSales = stats?.totalSales || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalProducts = stats?.totalProducts || 0;
  const totalCustomers = stats?.totalCustomers || 0;
  const weeklyOrders = stats?.weeklyOrders || [];
  const categorySales = stats?.categorySales || [];

  // Average Order Value (AOV)
  const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Donut chart calculations
  const totalCategorySales = categorySales.reduce((sum, c) => sum + c.value, 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Formatted date string matching the design
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Line chart coordinates mapping
  const maxWeeklyCount = Math.max(...weeklyOrders.map(d => d.count), 2);
  const chartWidth = 500;
  const chartHeight = 150;
  const paddingLeft = 40;
  const paddingTop = 20;

  const points = weeklyOrders.map((d, i) => {
    const x = paddingLeft + i * (chartWidth / 6);
    const y = paddingTop + chartHeight - (d.count / maxWeeklyCount) * chartHeight;
    return { x, y, count: d.count, date: d.date };
  });

  // SVG Bezier path generator for line chart
  const getBezierPath = (points) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = getBezierPath(points);
  const fillPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z` 
    : '';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 text-left pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchStats(true)}
            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#0e9f6e] hover:border-[#0e9f6e] shadow-sm transition-all flex items-center justify-center"
            title="Refresh stats"
            disabled={refreshing}
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#0e9f6e]' : ''}`} />
          </button>
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-700 tracking-wide">System Status: Online</span>
          </div>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL SALES */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Sales</p>
              <h3 className="text-2xl font-extrabold text-gray-900">₹{totalSales}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50/50 px-2 py-1 rounded-md w-fit">
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>Realistic Store Total</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <span className="text-lg font-bold">₹</span>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{totalOrders}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50/50 px-2 py-1 rounded-md w-fit">
              <FiActivity className="w-3.5 h-3.5" />
              <span>AOV: ₹{aov}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <FiShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Products</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{totalProducts}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold bg-purple-50/50 px-2 py-1 rounded-md w-fit">
              <FiBox className="w-3.5 h-3.5" />
              <span>Live in Catalog</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
            <FiBox className="w-5 h-5" />
          </div>
        </div>

        {/* CUSTOMERS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customers</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{totalCustomers}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50/50 px-2 py-1 rounded-md w-fit">
              <FiUsers className="w-3.5 h-3.5" />
              <span>Registered Accounts</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <FiUsers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Orders Overview Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[360px] lg:col-span-2 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Weekly Orders Overview</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
                Realtime Sync
              </span>
            </div>
          </div>

          <div className="relative flex-1 w-full min-h-[200px]">
            {/* Tooltip Overlay */}
            {activePoint && (
              <div 
                className="absolute bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none z-10 font-semibold space-y-0.5 border border-slate-800 transition-all duration-150 ease-out"
                style={{ 
                  left: `${((activePoint.x - paddingLeft) / chartWidth) * 100 + 4}%`, 
                  top: `${((activePoint.y - paddingTop) / chartHeight) * 100}%`,
                  transform: 'translate(-50%, -125%)'
                }}
              >
                <div className="font-bold text-center text-white">{activePoint.count} {activePoint.count === 1 ? 'Order' : 'Orders'}</div>
                <div className="text-[10px] text-slate-400 font-normal text-center">{activePoint.date}</div>
              </div>
            )}

            <svg viewBox="0 0 580 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft + chartWidth} y2={paddingTop} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
              <line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={paddingLeft + chartWidth} y2={paddingTop + chartHeight / 2} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
              <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={paddingLeft + chartWidth} y2={paddingTop + chartHeight} stroke="#e5e7eb" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-bold font-mono">{maxWeeklyCount}</text>
              <text x={paddingLeft - 10} y={paddingTop + chartHeight / 2 + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-bold font-mono">{Math.round(maxWeeklyCount / 2)}</text>
              <text x={paddingLeft - 10} y={paddingTop + chartHeight + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-bold font-mono">0</text>

              {/* Gradient Area Fill */}
              {fillPath && <path d={fillPath} fill="url(#chartGradient)" className="transition-all duration-500 ease-in-out" />}

              {/* Path Line */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#8b5cf6" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="transition-all duration-500 ease-in-out"
                />
              )}

              {/* Interactive Circles / Dots */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActivePoint(p)}
                    onMouseLeave={() => setActivePoint(null)}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activePoint?.date === p.date ? '7' : '4.5'}
                    fill="#ffffff"
                    stroke={activePoint?.date === p.date ? '#6d28d9' : '#8b5cf6'}
                    strokeWidth="3"
                    className="pointer-events-none transition-all duration-150 ease-out"
                  />
                </g>
              ))}

              {/* X Axis Labels */}
              {weeklyOrders.map((d, i) => (
                <text 
                  key={i} 
                  x={paddingLeft + i * (chartWidth / 6)} 
                  y={paddingTop + chartHeight + 20} 
                  textAnchor="middle" 
                  className="text-[10px] fill-gray-400 font-bold font-mono"
                >
                  {d.date.substring(5)} {/* MM-DD */}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Sales by Category Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-[360px]">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight mb-2">Sales by Category</h3>

          {/* Donut graphic */}
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 200 200" className="w-[170px] h-[170px]">
              {/* Fallback circle background if no sales */}
              <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#f3f4f6" strokeWidth="18" />
              
              {/* Dynamic Slices */}
              {(() => {
                let currentOffset = 0;
                return categorySales.map((item, idx) => {
                  const percentage = item.value / totalCategorySales;
                  const strokeLength = circumference * percentage;
                  const strokeOffset = circumference - strokeLength + currentOffset;
                  currentOffset -= strokeLength;

                  // Skip rendering circle slice if value is 0
                  if (item.value === 0) return null;

                  return (
                    <circle
                      key={idx}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke={donutColors[idx % donutColors.length]}
                      strokeWidth="18"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      transform="rotate(-90 100 100)"
                      strokeLinecap={percentage > 0.03 ? 'round' : 'butt'}
                      className="transition-all duration-500 ease-out"
                    />
                  );
                });
              })()}
            </svg>

            {/* Centered Total */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sales</span>
              <span className="text-lg font-extrabold text-gray-800 mt-0.5">₹{stats?.totalSales || 0}</span>
            </div>
          </div>

          {/* Categories Legend List */}
          <div className="h-[100px] overflow-y-auto pr-1 flex flex-col gap-1 mt-4">
            {categorySales.map((item, idx) => {
              const percentage = Math.round((item.value / totalCategorySales) * 100);
              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1 hover:bg-gray-50/50 px-2 rounded-md transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: donutColors[idx % donutColors.length] }} 
                    />
                    <span className="font-semibold text-gray-700 truncate capitalize">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold font-mono">
                    <span className="text-gray-900">₹{item.value}</span>
                    {totalSales > 0 && item.value > 0 && (
                      <span className="text-[10px] text-gray-400 font-normal">({percentage}%)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
