'use client';
import { useState, useEffect, useRef } from 'react';

export default function SpecialtiesFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const specialties = [
    {
      icon: '💰',
      title: 'Only ₹10 Registration',
      description: 'Find your perfect partner at just 10 INR - Most affordable in India',
    //   highlight: true
    },
    {
      icon: '✅',
      title: '100% Verified Profiles',
      description: 'Every profile is manually verified for authenticity & genuineness'
    },
    {
      icon: '🔒',
      title: 'Complete Privacy',
      description: 'Your data is protected with bank-level security encryption'
    },
    {
      icon: '⚡',
      title: 'Instant Matching',
      description: 'Smart AI-powered matches based on compatibility & preferences'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Involvement',
      description: 'Option to involve family in the matchmaking process'
    },
    {
      icon: '💝',
      title: 'Success Guarantee',
      description: 'Thousands of successful marriages through our platform'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed top-60 right-6 z-50">
      {/* Desktop: Right Side Position */}
      <div className="hidden xl:block" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-br from-primary/40 to-primary text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20 animate-bounce mb-4"
        >
          <span className="text-2xl">💖</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
        </button>

        {/* Expanded Card */}
        {isOpen && (
          <div 
            ref={popupRef}
            className="bg-gradient-to-br from-primary/20  to-primary rounded-2xl p-6 shadow-2xl border-2 border-white/20 backdrop-blur-lg w-80 max-h-96 animate-slide-in-right "
          >
            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">💖</span>
              </div>
              <h3 className="text-white text-lg font-bold font-serif">Why We're Special</h3>
              <div className="w-12 h-1 bg-yellow-400 rounded-full mx-auto mt-1"></div>
            </div>

            {/* Specialties List - Fixed height with scroll */}
            <div className="space-y-3 max-h-48 overflow-hidden relative">
  <div className="animate-auto-scroll">
    {/* First set */}
    {specialties.map((specialty, index) => (
      <div
        key={`first-${index}`}
        className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transition-all duration-200 hover:bg-white/20 mb-3 ${
          specialty.highlight ? 'ring-1 ring-yellow-400 ring-opacity-50' : ''
        }`}
      >
        <div className="flex items-start space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
            specialty.highlight 
              ? 'bg-yellow-400 text-gray-800 animate-pulse' 
              : 'bg-white/20 text-white'
          }`}>
            {specialty.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-lg ${
              specialty.highlight ? 'text-secondary' : 'text-secondary'
            }`}>
              {specialty.title}
            </h4>
            <p className="text-yellow-800 text-sm mt-0.5 leading-tight">
              {specialty.description}
            </p>
          </div>
        </div>
      </div>
    ))}
    {/* Duplicate set for seamless loop */}
    {specialties.map((specialty, index) => (
      <div
        key={`second-${index}`}
        className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transition-all duration-200 hover:bg-white/20 mb-3 ${
          specialty.highlight ? 'ring-1 ring-yellow-400 ring-opacity-50' : ''
        }`}
      >
        <div className="flex items-start space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
            specialty.highlight 
              ? 'bg-yellow-400 text-gray-800 animate-pulse' 
              : 'bg-white/20 text-white'
          }`}>
            {specialty.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-xs ${
              specialty.highlight ? 'text-yellow-300' : 'text-white'
            }`}>
              {specialty.title}
            </h4>
            <p className="text-white/80 text-xs mt-0.5 leading-tight">
              {specialty.description}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
  
  {/* Gradient fade effects */}
  <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-secondary/40 to-transparent pointer-events-none"></div>
  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-secondary/50 to-transparent pointer-events-none"></div>
</div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                document.getElementById('registration-cta')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-bold mt-4 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-yellow-500 text-sm"
            >
              Find Partner at ₹10 Only
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Mobile: Bottom Right Position */}
      <div className="xl:hidden fixed bottom-6 right-6">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20 animate-bounce"
        >
          <span className="text-2xl">💖</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
        </button>

        {/* Expanded Card */}
        {isOpen && (
          <div 
            ref={popupRef}
            className="absolute bottom-20 right-0 w-80 max-h-80 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-4 shadow-2xl border-2 border-white/20 backdrop-blur-lg animate-slide-in-up"
          >
            {/* Header */}
            <div className="text-center mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <span className="text-lg">💖</span>
              </div>
              <h3 className="text-white text-base font-bold font-serif">Why We're Special</h3>
              <div className="w-12 h-1 bg-yellow-400 rounded-full mx-auto mt-1"></div>
            </div>

            {/* Specialties List - Fixed height with scroll */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className={`bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 ${
                    specialty.highlight ? 'ring-1 ring-yellow-400 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      specialty.highlight 
                        ? 'bg-yellow-400 text-gray-800' 
                        : 'bg-white/20 text-white'
                    }`}>
                      {specialty.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-xs ${
                        specialty.highlight ? 'text-yellow-300' : 'text-white'
                      }`}>
                        {specialty.title}
                      </h4>
                      <p className="text-white/80 text-xs mt-0.5 leading-tight">
                        {specialty.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                document.getElementById('registration-cta')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-bold mt-3 hover:bg-yellow-300 transition-all duration-300 shadow-lg border-2 border-yellow-500 text-xs"
            >
              Register at ₹10 Only
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Arrow pointing to toggle button */}
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-pink-500 transform rotate-45 border-r-2 border-b-2 border-white/20"></div>
          </div>
        )}
      </div>
    </div>
  );
}