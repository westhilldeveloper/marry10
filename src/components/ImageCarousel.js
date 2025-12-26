'use client';
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [images, setImages] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carouselImages'));
      const imagesData = querySnapshot.docs.map(doc => doc.data());
      setImages(imagesData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const startTransition = useCallback((newDirection, newIndex) => {
    setIsTransitioning(true);
    setDirection(newDirection);
    setNextIndex(newIndex);
    
    // End transition after animation
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 1000);
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    startTransition('next', newIndex);
  }, [currentIndex, images.length, isTransitioning, startTransition]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    startTransition('prev', newIndex);
  }, [currentIndex, images.length, isTransitioning, startTransition]);

  // Auto-rotate with pause on hover
  useEffect(() => {
    if (images.length === 0 || isTransitioning) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, nextSlide, isTransitioning]);

  const handleIndicatorClick = (index) => {
    if (isTransitioning || index === currentIndex) return;
    const newDirection = index > currentIndex ? 'next' : 'prev';
    startTransition(newDirection, index);
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto group">
      {/* 3D Cube Container */}
      <div className="relative h-[600px] perspective-1000">
        {/* Current Image with Multiple Effects */}
        <div className={`absolute inset-0 w-full h-full transition-all duration-1000 transform-style-3d ${
          isTransitioning 
            ? direction === 'next'
              ? 'rotate-y-180 scale-95 opacity-0' 
              : 'rotate-y--180 scale-95 opacity-0'
            : 'rotate-y-0 scale-100 opacity-100'
        }`}>
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            {/* Main Image with Parallax Effect */}
            <img
              src={images[currentIndex]?.imageUrl}
              alt="Carousel"
              className={`w-full h-full object-cover transition-all duration-1000 ${
                isTransitioning 
                  ? direction === 'next'
                    ? 'translate-x-full blur-sm' 
                    : '-translate-x-full blur-sm'
                  : 'translate-x-0 blur-0'
              } group-hover:scale-110`}
              style={{ transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 mix-blend-overlay" />
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse-slow" />
            
            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/40 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Next Image (for smooth transitions) */}
        {isTransitioning && (
          <div className={`absolute inset-0 w-full h-full transition-all duration-1000 transform-style-3d ${
            direction === 'next'
              ? 'rotate-y-0 scale-100 opacity-100' 
              : 'rotate-y-0 scale-100 opacity-100'
          }`}>
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <img
                src={images[nextIndex]?.imageUrl}
                alt="Carousel Next"
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  direction === 'next'
                    ? 'translate-x-0 blur-0' 
                    : 'translate-x-0 blur-0'
                }`}
                style={{ transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 mix-blend-overlay" />
            </div>
          </div>
        )}
      </div>

      {/* Advanced Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white p-4 rounded-2xl shadow-2xl hover:bg-white/30 transition-all duration-500 border border-white/30 hover:border-white/50 disabled:opacity-50 group/btn z-20"
      >
        <div className="relative">
          <span className="text-2xl font-bold block transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:-translate-x-1">‹</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/50 to-purple-500/50 blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
      </button>
      
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg text-white p-4 rounded-2xl shadow-2xl hover:bg-white/30 transition-all duration-500 border border-white/30 hover:border-white/50 disabled:opacity-50 group/btn z-20"
      >
        <div className="relative">
          <span className="text-2xl font-bold block transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:translate-x-1">›</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/50 to-pink-500/50 blur-sm opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
      </button>

      {/* Advanced Indicators with Progress */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            disabled={isTransitioning}
            className="relative group/indicator"
          >
            <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            } ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}>
              {/* Pulsing effect for active indicator */}
              {index === currentIndex && (
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-60" />
              )}
            </div>
            
            {/* Hover tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/indicator:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              View {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Floating Info Card */}
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-lg text-white p-4 rounded-2xl border border-white/20 transform transition-all duration-500 hover:scale-105 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-pink-500/30 rounded-full blur-3xl animate-glow-slow" />
        <div className="absolute top-1/2 right-1/4 w-1/3 h-1/3 bg-purple-500/30 rounded-full blur-3xl animate-glow-slower" />
      </div>
    </div>
  );
}