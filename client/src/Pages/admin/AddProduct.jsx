import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { getImageUrl } from '../../axios';

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editProduct = location.state?.product || null;
  const isEditMode = !!editProduct;

  const [hasVariants, setHasVariants] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    salePrice: '',
    quantity: '',
    tags: '',
    category: '',
    offer: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);

  const { postProduct, putProduct, getCategories } = UserService();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        price: editProduct.price || '',
        salePrice: editProduct.salePrice || '',
        quantity: editProduct.quantity || '',
        tags: Array.isArray(editProduct.tags) ? editProduct.tags.join(', ') : (editProduct.tags || ''),
        category: editProduct.category?._id || editProduct.category || '',
        offer: editProduct.offer || '',
        description: editProduct.description || '',
        image: null
      });
      setHasVariants(editProduct.hasVariants || false);
    }
  }, [editProduct]);

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
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const productData = new FormData();

      productData.append("name", formData.name);
      productData.append("price", Number(formData.price));
      productData.append(
        "salePrice",
        formData.salePrice ? Number(formData.salePrice) : 0
      );
      productData.append("quantity", Number(formData.quantity));

      if (formData.tags) {
        formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
          .forEach(tag => {
            productData.append("tags", tag);
          });
      }

      productData.append("category", formData.category);
      productData.append("offer", formData.offer || '');
      productData.append("description", formData.description);
      productData.append("hasVariants", hasVariants);

      if (formData.image) {
        productData.append("image", formData.image);
      }

      let data;
      if (isEditMode) {
        data = await putProduct(editProduct._id, productData);
        setMessage({
          type: 'success',
          text: 'Product updated successfully!'
        });
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        data = await postProduct(productData);
        setMessage({
          type: 'success',
          text: 'Product added successfully!'
        });

        // Reset form
        setFormData({
          name: '',
          price: '',
          salePrice: '',
          quantity: '',
          tags: '',
          category: '',
          offer: '',
          description: '',
          image: null
        });
        setHasVariants(false);
      }

      console.log(data);

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save product';
      setMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 w-full max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-sm text-gray-500">{isEditMode ? 'Update your product and necessary information from here' : 'Add your product and necessary information from here'}</p>
        </div>
        
        {/* Variants Toggle */}
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100 shadow-sm">
          <span className="text-sm font-medium text-orange-400">Does this product have variants?</span>
          <button 
            type="button"
            onClick={() => setHasVariants(!hasVariants)}
            className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${hasVariants ? 'bg-[#0e9f6e]' : 'bg-[#f05030]'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${hasVariants ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        
        {/* Row 1: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Title/Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Sale Price</label>
            <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} min="0" className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors" />
          </div>
        </div>

        {/* Row 2: 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Product Tags (comma separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors bg-white appearance-none"
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) && categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Offer</label>
            <select name="offer" value={formData.offer} onChange={handleChange} className="w-full px-4 py-2.5 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors bg-white appearance-none">
              <option value="">Select Offers</option>
              <option value="10">10% Off</option>
              <option value="20">20% Off</option>
            </select>
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Product Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 rounded border border-gray-200 focus:outline-none focus:border-[#0e9f6e] focus:ring-1 focus:ring-[#0e9f6e] transition-colors resize-y"
          ></textarea>
        </div>

        {/* Row 4: Images */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Product Images</label>
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer p-4">
            {formData.image ? (
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{formData.image.name}</span>
                <span className="text-xs text-[#0e9f6e] font-semibold">File selected! Click to change.</span>
              </div>
            ) : editProduct && editProduct.images && editProduct.images.length > 0 ? (
              <div className="flex items-center gap-3">
                <img src={getImageUrl(editProduct.images[0])} alt={editProduct.name} className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-100" />
                <div className="flex flex-col items-start gap-1 text-left">
                  <span className="text-xs text-gray-500 font-medium truncate max-w-xs">{editProduct.images[0]}</span>
                  <span className="text-xs text-[#0e9f6e] font-semibold">Current image. Click to change.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm font-medium text-gray-600">Choose an image or drag it here</span>
                <span className="text-xs text-gray-400">PNG, JPG, JPEG up to 10MB</span>
              </div>
            )}
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="hidden"
              key={formData.image ? 'has-image' : 'no-image'}
            />
          </label>
        </div>
        
        {/* Action Button */}
        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-[#0e9f6e] hover:bg-[#0c8a5f] text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (isEditMode ? 'Updating Product...' : 'Adding Product...') : (isEditMode ? 'Update Product' : 'Add Product')}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
