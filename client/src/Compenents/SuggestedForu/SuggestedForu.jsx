import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../CartContext";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { getImageUrl } from "../../axios";

const SuggestedForu = () => {
    const scrollRef = useRef(null);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();

    const handleAddToCart = async (product) => {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        const cartProduct = {
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: discount ? `${discount}% off` : "",
            image: product.img
        };

        if (!auth?.accessToken) {
            sessionStorage.setItem('pendingCartItem', JSON.stringify({ product: cartProduct, quantity: 1 }));
            navigate('/login', { state: { from: location } });
            return;
        }

        try {
            await addToCart(cartProduct, 1);
            toast.success('Item added to cart successfully!');
        } catch (error) {
            // Handled
        }
    };
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetching exactly 8 products to act as suggested items
                const { data } = await axios.get("http://localhost:5000/api/products");

                const formattedProducts = data.map((product) => {
                    const hasSalePrice = product.salePrice && product.salePrice > 0;
                    return {
                        id: product._id,
                        title: product.name,
                        price: hasSalePrice ? product.salePrice : product.price,
                        originalPrice: hasSalePrice ? product.price : null,
                        img: product.images?.[0]
                            ? getImageUrl(product.images[0])
                            : "https://via.placeholder.com/500?text=Fragranzia+Perfume",
                    };
                });

                setSuggestedProducts(formattedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="w-full py-10 flex justify-center text-gray-500">Loading suggestions...</div>;
    }

    if (suggestedProducts.length === 0) return null;

    return (
        <section className="py-12 w-full mx-auto max-w-screen-2xl overflow-hidden mt-8 border-t border-gray-100">
            {/* Header carefully aligned to card boundaries using standard container px, but no internal offsets */}
            <div className="flex justify-between items-center mb-8 px-6 lg:px-12">
                <h2 className="text-[26px] lg:text-[30px] font-bold text-black tracking-tight">
                    Featured <span className="text-[#0a3b4c]">Collections</span>
                </h2>

                {/* Navigation Arrows perfectly matched from Home.jsx */}
                <div className="flex space-x-3">
                    <button
                        onClick={scrollLeft}
                        className="w-[44px] h-[44px] rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition cursor-pointer text-gray-800"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-[44px] h-[44px] rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition cursor-pointer text-gray-800"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Cards Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 lg:gap-5 overflow-x-auto pb-10 snap-x snap-mandatory pt-4 px-6 lg:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {suggestedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 w-[280px] lg:w-[320px] xl:w-[340px] snap-start group flex flex-col h-full"
                    >

                        {/* Clickable Wrapper for Image and Title */}
                        <div 
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="cursor-pointer"
                        >
                            {/* Image Wrapper */}
                            <div className="relative w-full h-[320px] lg:h-[360px] xl:h-[380px] bg-white border-[2px] border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.25)] rounded-tl-[100px] rounded-br-[100px] rounded-tr-[5px] rounded-bl-[5px] group-hover:rounded-tl-[5px] group-hover:rounded-br-[5px] group-hover:rounded-tr-[100px] group-hover:rounded-bl-[100px] transition-all duration-500 ease-in-out flex items-center justify-center p-8 mb-6">
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] group-hover:scale-[1.05] transition-transform duration-500"
                                />
                            </div>

                            {/* Product Info Title */}
                            <h3 className="text-[16px] lg:text-[18px] font-semibold text-[#111] leading-[1.3] mb-2 line-clamp-2 min-h-[46px] lg:min-h-[50px] hover:text-[#063344] transition-colors">
                                {product.title}
                            </h3>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex flex-col flex-grow w-full px-0.5">
                            <div className="flex items-center space-x-3 mt-1 mb-6">
                                <span className="text-[19px] lg:text-[23px] font-[800] text-black tracking-tight">
                                    RS {product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-[14px] lg:text-[16px] font-medium text-[#888] line-through">
                                        RS {product.originalPrice}
                                    </span>
                                )}
                            </div>

                            {/* Standardized CTA button pad */}
                            <button 
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-[#063344] text-white font-medium text-[15px] lg:text-[16px] py-[13px] lg:py-[15px] rounded-[5px] hover:bg-[#042431] transition-all tracking-wide mt-auto cursor-pointer"
                            >
                                Add to Cart
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};

export default SuggestedForu;
