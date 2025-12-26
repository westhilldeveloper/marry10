'use client';
import { useState } from 'react';

export default function SpecialtiesMobile() {
  const [isOpen, setIsOpen] = useState(false);

  const specialties = [
    {
      icon: '💰',
      title: 'Only ₹10 Registration',
      description: 'Find your perfect partner at just 10 INR',
      highlight: true
    },
    {
      icon: '✅',
      title: 'Verified Profiles',
      description: '100% authentic and genuine profiles'
    },
    {
      icon: '🔒',
      title: 'Complete Privacy',
      description: 'Bank-level security for your data'
    },
    {
      icon: '⚡',
      title: 'Instant Matching',
      description: 'AI-powered compatibility matching'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 xl:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/20 animate-bounce"
      >
        <span className="text-xl">💖</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
      </button>

      {/* Expanded Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-4 shadow-2xl border-2 border-white/20 backdrop-blur-lg">
          <div className="text-center mb-4">
            <h3 className="text-white font-bold font-serif">Special Offer!</h3>
            <p className="text-white/80 text-sm">Register at just ₹10</p>
          </div>

          <div className="space-y-3">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-3 border border-white/20"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{specialty.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{specialty.title}</p>
                    <p className="text-white/70 text-xs">{specialty.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              document.getElementById('registration-cta')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-bold mt-4 hover:bg-yellow-300 transition-all duration-300"
          >
            Register Now ₹10
          </button>
        </div>
      )}
    </div>
  );
}