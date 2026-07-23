import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Compenents/Navbar/Navbar';
import PromoBanner from '../../Compenents/PromoBanner/PromoBanner';
import Hero from '../../Compenents/Hero/Hero';
import yellowGlass from '../../assets/yellowglass.png';
import blackGlass from '../../assets/blackglass.png';
import pinkGlass from '../../assets/pinkglass.png';
import newBadgeImg from '../../assets/newbadge.png';
import truckIcon from '../../assets/truck.png';
import tickIcon from '../../assets/tick.png';
import locationIcon from '../../assets/location.png';
import FeaturedCollections from '../../Compenents/FeaturedCollections/FeaturedCollections';
import newArrivals from '../../assets/new_arrivals.png';
import limitedEdition from '../../assets/limited_edition.png';
import bestSellers from '../../assets/best_sellers.png';
import cat1 from '../../assets/cat1.png';
import cat2 from '../../assets/cat2.png';
import cat3 from '../../assets/cat3.png';
import cat4 from '../../assets/cat4.png';
import eleganceBanner from '../../assets/elegance_banner.png';
import Footer from '../../Compenents/Footer/Footer';
const Home = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <main>
      <Navbar />
      <PromoBanner />
      <Hero />

      {/* Promotional Cards Section */}
      <section className="px-5 lg:px-10 py-5 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">

          {/* Card 1 */}
          <div className="bg-[#f0eff1] rounded-[24px] overflow-hidden p-6 lg:p-8 flex items-center min-h-[220px] lg:min-h-[260px] relative">
            <div className="relative z-10 max-w-[55%]">
              <h3 className="text-[22px] lg:text-[26px] font-extrabold text-[#111] leading-[1.2] mb-3">
                Unlock Exclusive<br />Offers
              </h3>
              <p className="text-gray-800 text-[13px] lg:text-[14px] leading-snug font-medium">
                Discover special deals<br />tailored just for you!
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-[50%] z-0 flex items-center justify-end">
              <img
                src={yellowGlass}
                alt="Exclusive Offers"
                className="w-full h-[95%] lg:h-full object-contain object-right lg:pr-4"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f0eff1] rounded-[24px] overflow-hidden pt-6 lg:pt-8 px-6 pb-0 flex flex-col items-center min-h-[220px] lg:min-h-[260px] relative text-center">
            <div className="z-10 w-full mb-3">
              <h3 className="text-[19px] lg:text-[22px] font-extrabold text-[#111] leading-[1.2] mb-2 tracking-tight">
                Gift a Scents to your loved one.
              </h3>
              <p className="text-gray-800 text-[13px] lg:text-[14px] font-medium">
                Make your love more beautiful
              </p>
            </div>
            <div className="w-full flex-grow relative mt-auto z-0 h-[120px] lg:h-[140px] flex items-end justify-center">
              <img
                src={blackGlass}
                alt="Gift a Scent"
                className="w-auto h-[120%] lg:h-[135%] object-contain object-bottom translate-y-3"
              />
            </div>
          </div>


          {/* Card 3 */}
          <div className="bg-[#f0eff1] rounded-[24px] overflow-hidden p-6 lg:p-8 flex flex-col justify-start min-h-[220px] lg:min-h-[260px] relative">
            <div className="z-10 w-[65%] mb-4">
              <h3 className="text-[20px] lg:text-[24px] font-extrabold text-[#111] leading-[1.2]">
                Luxury Scents<br />Starting at ₹4,000
              </h3>
            </div>


            {/* Shop Now Badge */}
            <div className="absolute left-4 bottom-4 lg:left-6 lg:bottom-5 w-[110px] h-[110px] lg:w-[150px] lg:h-[150px] z-20 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer">
              <img
                src={newBadgeImg}
                alt="Shop Now"
                className="w-full h-full object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
              <span className="absolute font-bold text-white text-[13px] lg:text-[18px] leading-[1.2] text-center -rotate-[15deg] drop-shadow">
                Shop<br />Now
              </span>
            </div>

            {/* Right Image */}
            <div className="absolute right-[-10px] lg:-right-[20px] bottom-0 w-[55%] h-[85%] lg:h-[90%] z-0 flex items-end justify-end">
              <img
                src={pinkGlass}
                alt="Luxury Scents"
                className="w-full h-full object-contain object-bottom pb-2"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="px-5 lg:px-10 pb-8 w-full mt-2 lg:mt-4">
        <div className="w-full border border-gray-100 rounded-[16px] lg:rounded-[24px] px-6 py-8 lg:px-12 lg:py-10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] lg:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 lg:gap-8">

            {/* Feature 1 */}
            <div className="flex items-center space-x-5 lg:space-x-6 flex-1 md:justify-start">
              <div className="flex-shrink-0">
                <img
                  src={truckIcon}
                  alt="Fast & Reliable Delivery"
                  className="w-[48px] h-[48px] lg:w-[64px] lg:h-[64px] object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[#111] font-bold text-[16px] lg:text-[19px] mb-1 lg:mb-1.5 leading-tight tracking-tight">
                  Fast & Reliable Delivery
                </h4>
                <p className="text-gray-800 text-[13px] lg:text-[14px] leading-snug font-medium max-w-[220px]">
                  Get your orders delivered on time, every time.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center space-x-5 lg:space-x-6 flex-1 md:justify-center">
              <div className="flex-shrink-0">
                <img
                  src={tickIcon}
                  alt="Secure Payments"
                  className="w-[48px] h-[48px] lg:w-[64px] lg:h-[64px] object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[#111] font-bold text-[16px] lg:text-[19px] mb-1 lg:mb-1.5 leading-tight tracking-tight">
                  Secure Payments
                </h4>
                <p className="text-gray-800 text-[13px] lg:text-[14px] leading-snug font-medium max-w-[230px]">
                  Shop with confidence using our encrypted payment gateways.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center space-x-5 lg:space-x-6 flex-1 md:justify-end">
              <div className="flex-shrink-0">
                <img
                  src={locationIcon}
                  alt="24/7 Customer Support"
                  className="w-[48px] h-[48px] lg:w-[64px] lg:h-[64px] object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[#111] font-bold text-[16px] lg:text-[19px] mb-1 lg:mb-1.5 leading-tight tracking-tight">
                  24/7 Customer Support
                </h4>
                <p className="text-gray-800 text-[13px] lg:text-[14px] leading-snug font-medium max-w-[230px]">
                  We're here to assist you anytime, anywhere.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Explore Categories Section */}


      <FeaturedCollections />



      {/* Quote Section */}
      <section className="px-5 lg:px-10 pb-12 w-full flex justify-center">
        <div className="py-14 px-12 lg:py-16 lg:px-24 bg-white inline-flex items-center justify-center">
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '40px',
              lineHeight: '100%',
              letterSpacing: '0',
              textAlign: 'center',
              color: '#111',
            }}
          >
            "It's an art. A craft. A science. At Fragranzia, we're in<br />
            the business of creating memories that last forever<br />
            through our fragrances."
          </p>
        </div>
      </section>

      {/* Flexible Expanding Pictures Grid */}
      <section className="px-5 lg:px-10 pb-16 w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-5 w-full h-[450px] lg:h-[700px]">
          <div className="overflow-hidden rounded-[12px] flex-1 hover:flex-[1.8] transition-all duration-500 ease-in-out cursor-pointer relative group">
            <img src={newArrivals} alt="New Arrivals" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]" />
          </div>
          <div className="overflow-hidden rounded-[12px] flex-1 hover:flex-[1.8] transition-all duration-500 ease-in-out cursor-pointer relative group">
            <img src={limitedEdition} alt="Limited Edition" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]" />
          </div>
          <div className="overflow-hidden rounded-[12px] flex-1 hover:flex-[1.8] transition-all duration-500 ease-in-out cursor-pointer relative group">
            <img src={bestSellers} alt="Best Sellers" className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]" />
          </div>
        </div>
      </section>
      <section className="px-5 lg:px-10 py-10 w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[24px] lg:text-[28px] font-bold text-[#111]">
            Explore <span className="text-[#0a3b4c]">Categories</span>
          </h2>
          <Link to="/products" className="text-[14px] lg:text-[15px] font-semibold text-[#111] underline underline-offset-4 decoration-2 hover:text-[#0a3b4c] transition-colors">
            See All
          </Link>
        </div>

        <div className="flex justify-around items-center gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { img: cat1, name: 'Eau De Parfum' },
            { img: cat2, name: 'Concentrated' },
            { img: cat3, name: 'Deodorants' },
            { img: cat4, name: 'Body Mist' }
          ].map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center snap-center group cursor-pointer flex-shrink-0">
              <div className="w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center p-6 lg:p-8 mb-4 transition-transform duration-300 group-hover:shadow-md group-hover:scale-105">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <span className="font-semibold text-[14px] text-[#111] lg:text-[16px] text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* Offers Zone */}
      <FeaturedCollections
        titleNode="Offers Zone"
        showBadge={false}
      />

      {/* Elegance Banner Section */}
      <section className="px-5 lg:px-10 py-10 pb-16 w-full">
        <div className="relative w-full min-h-[280px] lg:min-h-[360px] rounded-[16px] lg:rounded-[24px] overflow-hidden flex flex-col md:flex-row items-center shadow-md bg-[#caf2fa]">

          {/* Background Image - Perfectly fitted, scaled down, positioned right */}
          <div className="absolute inset-y-0 right-0 w-full flex justify-end items-center pointer-events-none overflow-hidden pr-0 lg:pr-4">
            <img src={eleganceBanner} alt="Elegance in Every Bottle" className="h-[85%] lg:h-[95%] w-auto object-contain object-right" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-12 w-full md:max-w-[60%] lg:max-w-[50%] text-left">
            <h2 className="text-[20px] sm:text-[28px] lg:text-[36px] font-bold text-[#111] mb-2 leading-tight">
              Elegance in Every Bottle
            </h2>
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-800 mb-6 lg:mb-8 font-medium">
              Discover timeless fragrances crafted for every moment
            </p>
            <button className="bg-[#073545] text-white font-semibold text-[14px] lg:text-[15px] px-8 py-3 lg:px-8 lg:py-3 rounded-[8px] lg:rounded-[10px] hover:bg-[#052632] hover:shadow-lg transition-all active:scale-[0.98]">
              Shop Now
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>

  );
};

export default Home;
