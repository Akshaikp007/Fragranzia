import React, { useState, useEffect } from 'react';
import caro1 from '../../assets/caro1.png';
import caro2 from '../../assets/caro2.png';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [caro1, caro2];

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, [slides.length]);

  return (
    <section className="px-5 lg:px-10 py-5 w-full">
      <div className="relative w-full rounded-[20px] lg:rounded-[32px] overflow-hidden shadow-sm group bg-[#033b4a]">
        
        {/* Horizontal Sliding Track */}
        <div 
          className="flex w-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img 
                src={slide} 
                alt={`Promotion Slide ${index + 1}`} 
                className="w-full h-auto object-cover pointer-events-none" 
              />
            </div>
          ))}
        </div>

        {/* Overlay: Shop Now Button */}
        <button 
          className="absolute left-[7%] top-[60%] sm:top-[55%] bg-white text-black font-extrabold text-[10px] sm:text-xs md:text-sm lg:text-lg px-4 py-2 sm:px-6 sm:py-3 lg:px-10 lg:py-4 rounded-full hover:bg-gray-100 shadow-md z-10 transition-transform active:scale-95"
        >
          Shop Now
        </button>

        {/* Overlay: Navigation Dots */}
        <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
          {slides.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 lg:h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === index ? 'w-8 sm:w-10 lg:w-12 bg-white' : 'w-2 lg:w-3 bg-white/40 hover:bg-white/70'
              }`}
            ></div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
