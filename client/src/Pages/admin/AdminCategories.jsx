import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FiSearch, FiPlus, FiDownload, FiUpload, FiX, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategory, setParentCategory] = useState('None');
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosPrivate.get('/api/categories');
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (isEditing) {
        await axiosPrivate.put(`/api/categories/${editCategoryId}`, {
          name,
          description,
          parentCategory
        });
        toast.success('Category updated successfully');
      } else {
        await axiosPrivate.post('/api/categories', {
          name,
          description,
          parentCategory
        });
        toast.success('Category added successfully');
      }

      // Reset form and refresh table
      setName('');
      setDescription('');
      setParentCategory('None');
      setIsEditing(false);
      setEditCategoryId(null);
      setIsDrawerOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (category) => {
    setIsEditing(true);
    setEditCategoryId(category._id);
    setName(category.name);
    setDescription(category.description || '');
    setParentCategory(category.parentCategory || 'None');
    setIsDrawerOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axiosPrivate.delete(`/api/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 relative overflow-hidden">
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <FiDownload /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
            <FiUpload /> Import
          </button>
        </div>
      </div>

      {/* Search and Add Action */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Categories"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9f6e] focus:border-transparent text-sm"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setEditCategoryId(null);
            setName('');
            setDescription('');
            setParentCategory('None');
            setIsDrawerOpen(true);
          }}
          className="ml-4 flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#0e9f6e] hover:bg-[#0c8a5e] text-white rounded-md transition-colors shadow-sm text-sm font-medium"
        >
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Parent Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                Array.isArray(categories) && categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cat.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cat.parentCategory}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(cat)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Category"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                          title="Delete Category"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="mt-auto p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600 bg-gray-50/50">
          <button className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-400 cursor-not-allowed">Previous</button>
          <span>Page 1 of 2</span>
          <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors text-gray-700">Next</button>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9f6e] focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              rows="4"
              placeholder="Category Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9f6e] focus:border-transparent text-sm resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
            <select 
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9f6e] focus:border-transparent text-sm text-gray-600 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1.2em_1.2em]" 
              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")` }}>
              <option>None</option>
              <option>Eau De Parfum</option>
              <option>Concentrated</option>
              <option>Deodorants</option>
              <option>Body Mist</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100 flex justify-between gap-4 bg-gray-50/50">
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="flex-1 py-2.5 bg-[#f05252] hover:bg-[#e04545] text-white rounded-md font-medium transition-colors shadow-sm text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveCategory}
            className="flex-1 py-2.5 bg-[#0e9f6e] hover:bg-[#0c8a5e] text-white rounded-md font-medium transition-colors shadow-sm text-sm"
          >
            {isEditing ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
