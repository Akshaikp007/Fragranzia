import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Navbar from '../../Compenents/Navbar/Navbar';
import { FiHeart, FiShare2 } from 'react-icons/fi';
import { FaTag } from 'react-icons/fa';
import SuggestedForu from '../../Compenents/SuggestedForu/SuggestedForu';
import Footer from '../../Compenents/Footer/Footer';
import { useCart } from '../../CartContext';
import { useWishlist } from '../../WishlistContext';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../axios';


function Productsinglepage() {
    const { id } = useParams();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data: p } = await axiosPrivate.get(`/api/products/${id}`);
                const hasSalePrice = p.salePrice && p.salePrice > 0;
                setProduct({
                    id: p._id,
                    title: p.name,
                    price: hasSalePrice ? p.salePrice : p.price,
                    originalPrice: hasSalePrice ? p.price : null,
                    image: p.images?.[0]
                        ? getImageUrl(p.images[0])
                        : "https://via.placeholder.com/500?text=Fragranzia+Perfume",
                    images: p.images ? p.images.map(img => getImageUrl(img)) : [],
                    description: p.description,
                    quantity: p.quantity !== undefined ? p.quantity : 0
                });
                setQuantity(p.quantity > 0 ? 1 : 0);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch product", err);
                setProduct(null);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, axiosPrivate]);

    if (loading) return <div className="text-center py-20 min-h-screen flex flex-col"><Navbar /><div className="flex-grow flex items-center justify-center font-bold text-xl">Loading...</div></div>;
    if (!product) return <div className="text-center py-20 min-h-screen flex flex-col"><Navbar /><div className="flex-grow flex items-center justify-center font-bold text-xl text-red-500">Product not found</div></div>;

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    const handleAddToCart = async () => {
        const cartProduct = { ...product, discount: `${discount}% off` };
        if (!auth?.accessToken) {
            sessionStorage.setItem('pendingCartItem', JSON.stringify({ product: cartProduct, quantity }));
            navigate('/login', { state: { from: location } });
            return;
        }
        try {
            await addToCart(cartProduct, quantity);
            toast.success('Item added to cart successfully!');
        } catch (error) {
            // Error alert is handled in CartContext
        }
    };

    return (
        <div className="font-sans min-h-screen bg-white text-[#111]">
            <Navbar />

            {/* Wrap the main layout to naturally hug its grouped contents */}
            <div className="w-full mx-auto px-6 lg:px-12 py-8 lg:py-12 flex justify-center">

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-[80px] xl:gap-[120px] w-fit">

                    {/* Left block - strictly constrained max-width so buttons exactly match image bounds */}
                    <div className="w-full lg:w-[500px] xl:w-[540px] flex flex-col flex-shrink-0">

                        {/* Breadcrumbs */}
                        <div className="text-[14px] text-[#444] font-medium tracking-wide mb-6">
                            Home &gt; Products &gt; <span className="text-[#888]">{product.title}</span>
                        </div>

                        {/* Images block */}
                        <div className="flex flex-row items-center justify-between w-full mb-8 relative">

                            {/* Thumbnails */}
                            <div className="flex flex-col gap-4 w-[75px] lg:w-[85px] flex-shrink-0 z-10">
                                <div className="border-[2px] border-[#0A3B4C] rounded-[6px] p-1.5 aspect-square flex items-center justify-center cursor-pointer bg-white">
                                    <img src={product.image} alt="thumb1" className="w-[90%] h-auto object-contain" />
                                </div>
                                <div className="border border-gray-200 rounded-[6px] p-1.5 aspect-square flex items-center justify-center cursor-pointer hover:border-gray-400 bg-white">
                                    <img src={product.image} alt="thumb2" className="w-[90%] h-auto object-contain mix-blend-multiply opacity-80" />
                                </div>
                                <div className="border border-gray-200 rounded-[6px] p-1.5 aspect-square flex items-center justify-center cursor-pointer hover:border-gray-400 bg-white relative overflow-hidden">
                                    <img src={product.image} alt="thumb3" className="w-[90%] h-auto object-contain mix-blend-multiply opacity-50" />
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                        <span className="text-white px-1.5 py-0.5 rounded-[3px] text-[9px] font-bold tracking-wider" style={{ backgroundColor: '#0a2332' }}>Notes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main bottle image */}
                            <div className="flex-1 flex items-center justify-center h-[380px] lg:h-[480px]">
                                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                            </div>

                            {/* Side floating icons */}
                            <div className="flex flex-col gap-4 flex-shrink-0 z-10">
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-[48px] h-[48px] bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors ${isInWishlist(product.id) ? 'bg-red-50 border-red-200' : ''}`}
                                >
                                    <FiHeart className={`w-[22px] h-[22px] ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-[#0A3B4C]'}`} strokeWidth={2.3} />
                                </button>
                                <button className="w-[48px] h-[48px] bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                                    <FiShare2 className="w-[22px] h-[22px] text-[#222]" strokeWidth={2.3} />
                                </button>
                            </div>
                        </div>

                        {/* CTA Buttons - Hug perfectly with the Left column width */}
                        <div className="flex flex-col gap-3.5 w-full">
                            <button 
                                disabled={product.quantity <= 0}
                                className="w-full bg-[#063344] text-white font-bold text-[16px] xl:text-[18px] py-[16px] rounded-[4px] hover:bg-[#042431] transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {product.quantity <= 0 ? "Out of Stock" : "Purchase Now"}
                            </button>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={product.quantity <= 0}
                                className="w-full bg-white border-[2px] border-[#063344] text-[#063344] font-bold text-[16px] xl:text-[18px] py-[14px] rounded-[4px] hover:bg-gray-50 transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Right block */}
                    <div className="w-full lg:max-w-[550px] xl:max-w-[700px] flex flex-col pt-2 lg:pt-[24px]">

                        <h1 className="text-[28px] lg:text-[32px] xl:text-[34px] font-bold text-black leading-[1.2] mb-1 tracking-tight">
                            {product.title}
                        </h1>
                        <p className="text-[22px] text-black font-normal leading-none tracking-normal mb-3">
                            {product.title.split(' ')[0]}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1 font-bold text-[18px] text-black">
                                4.5 <span className="text-[#3ed05e] text-[18px]">★</span>
                            </div>
                            <span className="text-[#666] text-[16px] font-normal">1,000 Ratings</span>
                        </div>

                        {product.quantity <= 0 ? (
                            <p className="text-[#ff4040] font-bold text-[15px] mb-6 uppercase tracking-wider">
                                Temporarily Out of Stock
                            </p>
                        ) : product.quantity <= 5 ? (
                            <p className="text-[#ff9040] font-semibold text-[15px] mb-6 animate-pulse">
                                Hurry! Only {product.quantity} left in stock!
                            </p>
                        ) : (
                            <p className="text-green-600 font-semibold text-[15px] mb-6">
                                In Stock ({product.quantity} available)
                            </p>
                        )}

                        {/* Pricing */}
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-[40px] lg:text-[46px] font-extrabold text-black leading-none tracking-tight">
                                Rs {product.price}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-[18px] text-[#555] line-through decoration-[#555] font-medium">
                                        Rs {product.originalPrice}
                                    </span>
                                    <span className="text-[18px] text-[#24b24e] font-bold">
                                        {discount}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Quantity List - Color precisely matching the CTA button hex */}
                        <div className="flex items-center border-[2px] border-[#063344] w-[100px] rounded-[6px] h-[40px] mb-8">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={product.quantity <= 0}
                                className="flex-1 text-[22px] font-medium text-black h-full flex items-center justify-center pb-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >-</button>
                            <span className="flex-1 text-center font-bold text-[16px] text-black">
                                {product.quantity <= 0 ? 0 : quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                disabled={product.quantity <= 0 || quantity >= product.quantity}
                                className="flex-1 text-[22px] font-medium text-black h-full flex items-center justify-center pb-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >+</button>
                        </div>

                        {/* Delivery */}
                        <div className="mb-8">
                            <h3 className="font-bold text-[18px] text-black mb-2 tracking-wide">Delivery</h3>
                            <p className="text-[16px] text-[#111] font-normal leading-[1.6]">
                                Delivery by 28 Aug, Wednesday | Free<br />
                                <span className="text-[#222]">if ordered before 9:24 PM</span>
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-8 lg:pr-10">
                            <h3 className="font-bold text-[18px] text-black mb-2 tracking-wide">Description</h3>
                            <p className="text-[16px] text-[#111] leading-[1.7]">
                                This fragrance exudes a confident and enigmatic personality. Its composition features a top note of lemon and mandarin with a twist of apple that enhances the freshness. The heart reveals a warm blend of high-grade lavender and a hint of cinnamon, beautifully wrapped in patchouli, musk, and vanilla to ensure a powerful and flowing scent.
                            </p>
                        </div>

                        {/* Offers */}
                        <div>
                            <h3 className="font-bold text-[18px] text-black mb-4 tracking-wide">Available Offers</h3>
                            <ul className="flex flex-col gap-3">
                                <li className="flex items-start gap-3">
                                    <FaTag className="text-[#24b24e] mt-[4px] text-[16px] flex-shrink-0" />
                                    <span className="text-[16px] text-[#111] font-normal">Buy two of the same product and get a third one free.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaTag className="text-[#24b24e] mt-[4px] text-[16px] flex-shrink-0" />
                                    <span className="text-[16px] text-[#111] font-normal">Enjoy free standard shipping on orders exceeding ₹1,399.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaTag className="text-[#24b24e] mt-[4px] text-[16px] flex-shrink-0" />
                                    <span className="text-[16px] text-[#111] font-normal">Get 15% off your first order</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaTag className="text-[#24b24e] mt-[4px] text-[16px] flex-shrink-0" />
                                    <span className="text-[16px] text-[#111] font-normal">Receive a free tool case with the purchase of any perfume over ₹2,000</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            <SuggestedForu />
            {/* Global Edge-to-Edge component */}
            <Footer />
        </div>
    );
}

export default Productsinglepage;
