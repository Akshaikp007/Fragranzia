import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import { getImageUrl } from '../../axios';


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 8;

  const { getProduct, postProduct, putProduct, deleteProduct, getCategories } = UserService();
  const navigate = useNavigate();

  const handleEdit = (product) => {
    // Navigate to AddProduct page with product data for editing
    navigate('/admin/products/add-product', { state: { product } });
  };

  const fetchProducts = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const data = await getProduct(pageToFetch, limit);
      if (data && data.products) {
        setProducts(data.products);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } else {
        setProducts(data);
        setTotalPages(1);
        setTotalProducts(data.length || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Determine what the new current page should be
        const isLastItemOnPage = products.length === 1;
        const newPage = (isLastItemOnPage && currentPage > 1) ? currentPage - 1 : currentPage;
        
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
        } else {
          await fetchProducts(currentPage);
        }
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.message || 'Failed to delete product');
      }
    }
  };
  
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Fetched categories data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e9f6e] transition-colors">
            Export
          </button>
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e9f6e] transition-colors">
            Import
          </button>
        </div>
        <Link 
          to="/admin/products/add-product" 
          className="w-full sm:w-auto justify-center px-6 py-2.5 bg-[#0e9f6e] text-white rounded shadow-sm text-sm font-medium hover:bg-[#0c8e62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e9f6e] transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Product
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search Products..." 
          className="flex-1 px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors text-sm"
        />
        <select className="flex-1 px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors bg-white appearance-none text-sm text-gray-600">
          <option>All Categories</option>
          {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>
    
        <select className="flex-1 px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors bg-white appearance-none text-sm text-gray-600">
          <option>Any Variant Status</option>
        </select>
        <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded font-medium text-sm hover:bg-gray-300 transition-colors">
          Reset Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-200/60 text-gray-600 text-sm">
                <th className="py-3 px-4 font-semibold rounded-l-md">Product Name</th>
                <th className="py-3 px-4 font-semibold text-center">Category</th>
                <th className="py-3 px-4 font-semibold text-center">Variants</th>
                <th className="py-3 px-4 font-semibold text-center">Price</th>
                <th className="py-3 px-4 font-semibold text-center">Sale Price</th>
                <th className="py-3 px-4 font-semibold text-center">Stock</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
                <th className="py-3 px-4 font-semibold text-center rounded-r-md">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500 font-medium text-sm">
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-red-500 font-medium text-sm">
                    {error}
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500 font-medium text-sm">
                    No products available
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                          {product.images && product.images.length > 0 ? (
                            <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            'Img'
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{product.tags?.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600 capitalize">{product.category?.name || '-'}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.hasVariants ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {product.hasVariants ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-700">${product.price}</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-500">{product.salePrice > 0 ? `$${product.salePrice}` : '-'}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.quantity > 10 ? 'bg-green-100 text-green-700' : product.quantity > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                        {product.quantity} in stock
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className={`px-5 py-2 border rounded-lg text-sm font-medium transition-colors ${
            currentPage === 1 || loading
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        <div className="flex items-center gap-1.5 text-sm text-gray-700">
          <span className="mr-2 font-medium">
            Page {currentPage} of {totalPages} ({totalProducts} total items)
          </span>
          {getPageNumbers().map((pageNumber, idx) => (
            pageNumber === '...' ? (
              <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                disabled={loading}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-[#0e9f6e] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className={`px-5 py-2 border rounded-lg text-sm font-medium transition-colors ${
            currentPage === totalPages || loading
              ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminProducts;
