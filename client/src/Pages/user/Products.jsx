import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX, FiFilter, FiSliders } from "react-icons/fi";
import Navbar from '../../Compenents/Navbar/Navbar';
import Footer from '../../Compenents/Footer/Footer';
import ProductCard from '../../Compenents/ProductCard/ProductCard';
import PromoBanner from '../../Compenents/PromoBanner/PromoBanner';
import { BASE_URL, getImageUrl } from "../../axios";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState(searchQueryParam);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync search term with URL query param
  useEffect(() => {
    setSearchTerm(searchQueryParam);
  }, [searchQueryParam]);

  // Fetch Products and Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/products`),
          axios.get(`${BASE_URL}/api/categories`).catch(() => ({ data: [] }))
        ]);

        const rawProducts = Array.isArray(prodRes.data)
          ? prodRes.data
          : prodRes.data.products || [];

        const formattedProducts = rawProducts.map((product) => {
          const hasSalePrice = product.salePrice && product.salePrice > 0;
          return {
            id: product._id,
            name: product.name,
            price: hasSalePrice ? product.salePrice : product.price,
            originalPrice: hasSalePrice ? product.price : null,
            badge: "New",
            img: product.images?.[0]
              ? getImageUrl(product.images[0])
              : "https://via.placeholder.com/500?text=Fragranzia+Perfume",
            categoryName: product.category?.name || "Uncategorized",
            categoryId: product.category?._id || "",
            description: product.description || "",
            quantity: product.quantity !== undefined ? product.quantity : 0,
            createdAt: product.createdAt
          };
        });

        setProducts(formattedProducts);

        if (Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchCategory = product.categoryName.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCategory) return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          if (
            product.categoryName.toLowerCase() !== selectedCategory.toLowerCase() &&
            product.categoryId !== selectedCategory
          ) {
            return false;
          }
        }

        // Min price filter
        if (priceRange.min !== "" && !isNaN(priceRange.min)) {
          if (product.price < Number(priceRange.min)) return false;
        }

        // Max price filter
        if (priceRange.max !== "" && !isNaN(priceRange.max)) {
          if (product.price > Number(priceRange.max)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "popularity") return b.quantity - a.quantity;
        return 0; // relevance / default
      });
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange({ min: "", max: "" });
    setSortBy("relevance");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "All" || priceRange.min !== "" || priceRange.max !== "";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PromoBanner />

      <div className="max-w-6xl mx-auto px-4 mt-5">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="text-xs sm:text-sm text-gray-500 mb-1">
              Home &gt; Products {searchTerm && `> Search: "${searchTerm}"`}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              All Products
              <span className="text-lg font-medium text-gray-500">
                ({filteredProducts.length})
              </span>
            </h1>
          </div>

          {/* Sort & Filter Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            {/* Sort Buttons */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="mr-1 text-gray-400">Sort By:</span>
              <button
                onClick={() => setSortBy("relevance")}
                className={`px-2 py-1 rounded transition-colors ${
                  sortBy === "relevance"
                    ? "text-[#00354B] font-bold border-b-2 border-[#00354B]"
                    : "hover:text-gray-900"
                }`}
              >
                Relevance
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={`px-2 py-1 rounded transition-colors ${
                  sortBy === "newest"
                    ? "text-[#00354B] font-bold border-b-2 border-[#00354B]"
                    : "hover:text-gray-900"
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortBy("popularity")}
                className={`px-2 py-1 rounded transition-colors ${
                  sortBy === "popularity"
                    ? "text-[#00354B] font-bold border-b-2 border-[#00354B]"
                    : "hover:text-gray-900"
                }`}
              >
                Popularity
              </button>
              <button
                onClick={() => setSortBy("price_asc")}
                className={`px-2 py-1 rounded transition-colors ${
                  sortBy === "price_asc"
                    ? "text-[#00354B] font-bold border-b-2 border-[#00354B]"
                    : "hover:text-gray-900"
                }`}
              >
                Price--Low to High
              </button>
              <button
                onClick={() => setSortBy("price_desc")}
                className={`px-2 py-1 rounded transition-colors ${
                  sortBy === "price_desc"
                    ? "text-[#00354B] font-bold border-b-2 border-[#00354B]"
                    : "hover:text-gray-900"
                }`}
              >
                Price--High to Low
              </button>
            </div>

            {/* Filter Drawer Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 border rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                hasActiveFilters
                  ? "bg-[#00354B] text-white border-[#00354B]"
                  : "border-black hover:bg-gray-50 text-black"
              }`}
            >
              <FiSliders size={16} /> Filter ☰
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
              Active Filters:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-xs font-semibold px-3 py-1 rounded-full text-gray-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchParams({});
                  }}
                  className="hover:text-red-500"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-xs font-semibold px-3 py-1 rounded-full text-gray-800">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="hover:text-red-500"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {(priceRange.min !== "" || priceRange.max !== "") && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-xs font-semibold px-3 py-1 rounded-full text-gray-800">
                Price: ₹{priceRange.min || 0} - ₹{priceRange.max || "Any"}
                <button
                  onClick={() => setPriceRange({ min: "", max: "" })}
                  className="hover:text-red-500"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-xs text-red-600 hover:text-red-800 underline font-semibold ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex gap-8 pb-16">
          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-12 text-center">
                <div className="col-span-full py-16 text-gray-500 font-medium">
                  Loading products...
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center border rounded-xl bg-gray-50 p-8 my-4">
                <FiSearch size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                  We couldn't find any items matching your search or active filters. Try clearing your filters or searching for something else.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#00354B] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#002738] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Sidebar Drawer / Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <FiFilter /> Filter Products
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Search Field inside Drawer */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Search Keywords
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchTerm(val);
                        if (val.trim()) {
                          setSearchParams({ search: val }, { replace: true });
                        } else {
                          setSearchParams({}, { replace: true });
                        }
                      }}
                      placeholder="Search by perfume name..."
                      className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00354B]"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedCategory === "All"
                          ? "bg-[#00354B] text-white border-[#00354B]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          selectedCategory.toLowerCase() === cat.name.toLowerCase()
                            ? "bg-[#00354B] text-white border-[#00354B]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Price Range (₹)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Min Price</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                        }
                        className="w-full bg-gray-100 rounded-lg py-2 px-3 text-sm font-medium border border-gray-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#00354B]"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Max Price</span>
                      <input
                        type="number"
                        placeholder="10000"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                        }
                        className="w-full bg-gray-100 rounded-lg py-2 px-3 text-sm font-medium border border-gray-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#00354B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Option Selection inside Mobile / Drawer */}
                <div className="block sm:hidden">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg py-2.5 px-3 text-sm font-medium border border-gray-200"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest First</option>
                    <option value="popularity">Popularity</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-4">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-[#00354B] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#002738] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Products;