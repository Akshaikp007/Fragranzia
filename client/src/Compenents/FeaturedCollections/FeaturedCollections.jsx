import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import newBadgeImg from '../../assets/newbadge.png';
import { useCart } from '../../CartContext';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../axios';

const FeaturedCollections = ({ titleNode, showBadge = true }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
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

                setProducts(formattedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    };

    const NewBadge = () => (
        <div className="absolute top-1 left-1 z-10 w-[115px] h-[115px] flex items-center justify-center -rotate-[15deg] transition-transform duration-500 group-hover:scale-105">
            <img
                src={newBadgeImg}
                alt="New"
                className="w-full h-full object-contain absolute inset-0"
            />
            <span className="relative z-10 font-[Poppins] font-semibold text-white text-[16px] tracking-wide select-none translate-y-[-2px]">
                New
            </span>
        </div>
    );

    if (loading) {
        return (
            <section className="py-10 px-5 lg:px-10 w-full overflow-hidden">
                <div className="w-full py-10 flex justify-center text-gray-500">Loading collections...</div>
            </section>
        );
    }

    return (
        <section className="py-10 px-5 lg:px-10 w-full overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-[28px] lg:text-[32px] font-bold text-[#111]">
                    {titleNode || (
                        <React.Fragment>
                            Featured <span className="text-[#0a3b4c]">Collections</span>
                        </React.Fragment>
                    )}
                </h2>

                <div className="flex space-x-3">
                    <button
                        onClick={scrollLeft}
                        className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition cursor-pointer shadow-sm"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition cursor-pointer shadow-sm"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Cards Scroll Container */}
            <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 w-[290px] lg:w-[340px] snap-start group cursor-default flex flex-col h-full"
                    >
                        {/* Leaf Shape Image Card */}
                        <div className="relative w-full h-[320px] lg:h-[385px] bg-white border border-gray-100 shadow-[0_8px_28px_rgba(0,0,0,0.09)] rounded-tl-[120px] rounded-br-[120px] rounded-tr-[24px] rounded-bl-[24px] group-hover:rounded-tl-[24px] group-hover:rounded-br-[24px] group-hover:rounded-tr-[120px] group-hover:rounded-bl-[120px] transition-all duration-500 ease-in-out flex items-center justify-center p-8 mb-5">
                            {showBadge && <NewBadge />}
                            <img
                                src={product.img}
                                alt={product.title}
                                className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-grow">
                            <h3 className="text-[16px] font-bold text-[#111] leading-snug mb-2 min-h-[42px] line-clamp-2">
                                {product.title}
                            </h3>

                            <div className="flex items-center space-x-3 mt-1 mb-4">
                                <span className="text-[20px] font-[800] text-[#111] tracking-tight">
                                    RS {product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-[14px] font-medium text-gray-400 line-through">
                                        RS {product.originalPrice}
                                    </span>
                                )}
                            </div>

                            <button 
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-[#0a3b4c] text-white font-semibold text-[15px] py-[13px] rounded-[5px] hover:bg-[#063344] active:scale-[0.98] transition-all mt-auto"
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

export default FeaturedCollections;
