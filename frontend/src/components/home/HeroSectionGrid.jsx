import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpeg";

const HeroSectionGrid = () => {
  const { isAuthenticated } = useAuth();
  
  const previewImages = [
    img1,
    img2,
    img3,
    img4
  ];

  const stats = [
    { number: "12,000+", label: "Bookings Made" },
    { number: "98%", label: "Uptime SLA" },
    { number: "< 2 min", label: "Avg. Booking Time" },
  ];

  return (
    <section className="relative min-h-[85vh] bg-gray-900 flex items-center overflow-hidden">
      {/* Subtle grid pattern background */}

      {/* Content wrapper */}
      <div className="relative z-10 container mx-auto px-6 md:px-20 sm:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: TEXT */}
          <div className="text-center lg:text-left space-y-6 md:space-y-8 order-2 lg:order-1">
            <p className="text-sm font-semibold tracking-wider text-gray-200 uppercase">
              Facility Booking System
            </p>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-200 leading-tight tracking-tight">
              Book any space.{" "}
              <span className="text-gray-200">
                Right now.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Stop chasing availability over email. See what's open, claim your slot, 
              and get a confirmation in under two minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="px-6 sm:px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                >
                  Get Started Free
                </Link>
              )}
              <Link 
                to="/facilities" 
                className="px-6 sm:px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
              >
                Browse Facilities
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 pt-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-white text-center lg:text-left">
                  <h4 className="text-2xl sm:text-3xl font-bold">{stat.number}</h4>
                  <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div> */}
          </div>

          {/* RIGHT SIDE: IMAGE GRID */}
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 transform rotate-2 sm:rotate-3 max-w-xs sm:max-w-sm md:max-w-md">
              {previewImages.map((img, i) => (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden shadow-xl sm:shadow-2xl transition-transform duration-500 hover:scale-105 ${
                    i % 2 !== 0 ? "translate-y-6 sm:translate-y-8" : ""
                  }`}
                >
                  <img
                    src={img}
                    alt={`Facility ${i + 1}`}
                    className="w-full h-36 sm:h-48 md:h-48 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionGrid;