import React from 'react';
import { FiMail, FiPhone, FiInstagram, FiFacebook, FiYoutube, FiLinkedin } from 'react-icons/fi';
// In case the local react-icons version lacks an 'X', we can just use a span for the X logo
// However, if we restrict to standard Fi/Fa, let's use the core ones.

const Footer = () => {
    return (
        <footer className="bg-[#9ABCBF] w-full font-sans text-[#063344]">
            {/* Top Main Section */}
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                
                {/* Brand Logo Column */}
                <div className="flex flex-col justify-center lg:justify-start pt-2">
                    <h2 className="text-[36px] lg:text-[44px] font-[800] tracking-tight text-[#063344]">
                        Fragranzia
                    </h2>
                </div>

                {/* Pages Column */}
                <div className="flex flex-col gap-5">
                    <h3 className="font-bold text-[20px] mb-2 tracking-wide text-black">Pages</h3>
                    <ul className="flex flex-col gap-4">
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Home</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Products</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Gifting</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">About</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Profile</a></li>
                    </ul>
                </div>

                {/* Quick Links Column */}
                <div className="flex flex-col gap-5">
                    <h3 className="font-bold text-[20px] mb-2 tracking-wide text-black">Quick Links</h3>
                    <ul className="flex flex-col gap-4">
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Privacy policy</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Terms and conditions</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">FAQs</a></li>
                        <li><a href="#" className="font-[500] text-[16px] hover:underline">Customer service</a></li>
                    </ul>
                </div>

                {/* Contact & Social Column */}
                <div className="flex flex-col gap-8">
                    
                    {/* Contact List */}
                    <div className="flex flex-col gap-4 mt-1">
                        <div className="flex items-center gap-3">
                            <FiMail className="text-[22px] flex-shrink-0 text-black" strokeWidth={1.5} />
                            <a href="mailto:ftrafurniture@gmail.com" className="font-[500] text-[16px] hover:underline">
                                ftrafurniture@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiPhone className="text-[22px] flex-shrink-0 text-black" strokeWidth={1.5} />
                            <a href="tel:+919876543210" className="font-[500] text-[16px] hover:underline tracking-wide">
                                +91 9876543210
                            </a>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="font-bold text-[18px] lg:text-[20px] mb-4 tracking-wide text-black">Social Media</h3>
                        <div className="flex items-center gap-3 text-black">
                            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center hover:scale-110 transition-transform">
                                <FiInstagram className="w-full h-full" strokeWidth={1.5} />
                            </a>
                            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center hover:scale-110 transition-transform">
                                <FiFacebook className="w-full h-full" strokeWidth={1.5} />
                            </a>
                            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center hover:scale-110 transition-transform">
                                {/* Synthetic X Icon */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[80%] h-[80%]">
                                    <path d="M4 4l16 16m0-16L4 20" />
                                </svg>
                            </a>
                            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center hover:scale-110 transition-transform">
                                <FiYoutube className="w-full h-full" strokeWidth={1.5} />
                            </a>
                            <a href="#" className="w-[32px] h-[32px] flex items-center justify-center hover:scale-110 transition-transform">
                                <FiLinkedin className="w-full h-full" strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                </div>

            </div>

            {/* Bottom Copyright Row */}
            <div className="border-t border-[#063344] w-full">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-5 lg:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left Legal Links */}
                    <div className="flex items-center text-[14px] font-[500] tracking-wide text-[#063344]">
                        <a href="#" className="hover:underline">Web Accessibility</a>
                        <span className="mx-3 text-[#063344]">|</span>
                        <a href="#" className="hover:underline">Terms of Use</a>
                        <span className="mx-3 text-[#063344]">|</span>
                        <a href="#" className="hover:underline">Privacy Statement</a>
                        <span className="mx-3 text-[#063344]">|</span>
                        <a href="#" className="hover:underline">Contact Us</a>
                    </div>

                    {/* Right Attribution */}
                    <div className="text-[14px] font-[500] text-[#063344] tracking-wide">
                        © 2024 fragranzia Company. All rights reserved.
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
