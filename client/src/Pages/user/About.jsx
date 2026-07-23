import React from 'react';
import Navbar from '../../Compenents/Navbar/Navbar';
import Footer from '../../Compenents/Footer/Footer';

import aboutImage1 from '../../assets/about1.png';
import aboutImage2 from '../../assets/about2.png';

function About() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full flex flex-col lg:flex-row items-start justify-between mt-10 lg:mt-12 mb-12">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 w-full px-8 lg:pl-[120px] xl:pl-[160px] lg:pr-12 xl:pr-16">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-['Poppins',sans-serif] text-[38px] lg:text-[46px] font-semibold text-black tracking-tight mb-2 leading-none">
              About Fragranzia
            </h1>
            <div className="text-[14px] text-gray-500 font-medium mt-3">
              <span className="hover:text-gray-800 cursor-pointer">Home</span>{' '}
              <span className="mx-1">&gt;</span>{' '}
              <span>About</span>
            </div>
          </div>

          {/* Paragraphs */}
          <div className="font-['Poppins',sans-serif] font-normal text-[19px] lg:text-[20px] text-[#222] leading-[1.9] space-y-8 w-full">
            <p>
              At Fragranzia, we believe that a perfume is more than just a scent—it's a story,
              an art, and a science combined to create memories that linger. Our journey
              began with a vision to craft exquisite fragrances that capture the essence of
              individuality and elevate every moment into something timeless.
            </p>
            <p>
              Guided by passion and precision, we source the finest ingredients from
              around the world to create perfumes that resonate with authenticity and
              luxury. Each bottle is a masterpiece, meticulously crafted to deliver an
              unparalleled sensory experience.
            </p>
            <p>
              Our commitment goes beyond creating fragrances. We aim to inspire
              confidence, evoke emotions, and celebrate uniqueness through every drop
              we produce. Fragranzia isn't just a brand—it's a celebration of you, your style,
              and your moments.
            </p>
            <p>
              With a legacy built on quality, artistry, and innovation, we invite you to explore
              our collection and find a scent that speaks your story.
            </p>
          </div>
        </div>

        {/* Right Side: Curved Images (Flushed Right, Reduced Size) */}
        <div className="w-full lg:w-auto flex flex-col items-end pl-4 lg:pl-0 shrink-0">
          {/* Top Image: Man spraying (Rounded top-left) */}
          <div className="w-full lg:w-[380px] xl:w-[420px]">
            <img 
              src={aboutImage1} 
              alt="Man spraying perfume" 
              className="w-full h-[280px] lg:h-[320px] xl:h-[350px] object-cover rounded-tl-[120px] lg:rounded-tl-[160px] bg-gray-200"
            />
          </div>
          
          {/* Bottom Image: Woman (Rounded bottom-left) */}
          <div className="w-full lg:w-[380px] xl:w-[420px] mt-1 lg:mt-0">
            <img 
              src={aboutImage2} 
              alt="Woman applying perfume" 
              className="w-full h-[280px] lg:h-[320px] xl:h-[350px] object-cover rounded-bl-[120px] lg:rounded-bl-[160px] bg-gray-200"
            />
          </div>
        </div>
        
      </main>

      {/* Global Edge-to-Edge Footer */}
      <Footer />
    </div>
  );
}

export default About;