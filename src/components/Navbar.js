'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const pathname = usePathname();

  // Update active tab based on current route
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin', isSpecial: true }
  ];

  const isActive = (href) => activeTab === href;

  const getNavLinkClass = (item) => {
    const baseClasses = "text-2xl transition-all duration-300 font-bold py-2 px-4 rounded-lg relative overflow-hidden group";
    
    if (item.isSpecial) {
      return `${baseClasses} ${
        isActive(item.href) 
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25' 
          : 'text-secondary bg-secondary/5 hover:bg-secondary/10 hover:shadow-md'
      }`;
    }

    return `${baseClasses} ${
      isActive(item.href)
        ? 'text-white bg-white/20 shadow-lg'
        : 'text-white hover:text-primary hover:bg-white'
    }`;
  };

  const getMobileNavLinkClass = (item) => {
    const baseClasses = "transition-all duration-300 font-bold py-3 px-4 rounded-lg text-center border-l-4";
    
    if (item.isSpecial) {
      return `${baseClasses} ${
        isActive(item.href)
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-700 shadow-lg'
          : 'text-secondary bg-secondary/5 border-secondary/20 hover:bg-secondary/10'
      }`;
    }

    return `${baseClasses} ${
      isActive(item.href)
        ? 'bg-white/10 text-white border-white shadow-lg'
        : 'text-secondary border-transparent hover:bg-secondary/10 hover:border-secondary/30'
    }`;
  };

  // Find active tab index for the bottom indicator
  const activeTabIndex = navigationItems.findIndex(item => isActive(item.href));

  return (
    <nav className="bg-gradient-to-r from-primary/10 to-primary shadow-2xl border-b-4 border-yellow-600 sticky top-0 z-50 backdrop-blur-sm ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/images/mr10.jpeg" 
                alt="Matrimony Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-4xl font-bold text-yellow-400 drop-shadow-lg relative">
  {/* Glow animation above text */}
  <div className="absolute top-6 left-0 right-0 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
  </div>
  
  {/* Glow effect that moves */}
  <div className="absolute -top-3 left-0 w-4 h-2 bg-yellow-300 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-sweep"></div>
  
  Marry@10
  
</div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-2">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item)}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"></div>
                )}
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-secondary p-3 hover:bg-white/10 rounded-lg transition-all duration-300 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isMenuOpen ? 'rotate-45' : '-translate-y-2'
              }`}></span>
              <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isMenuOpen ? '-rotate-45' : 'translate-y-2'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={getMobileNavLinkClass(item)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10 text-lg">{item.label}</span>
                  {isActive(item.href) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active tab indicator for desktop */}
      {/* <div className="hidden md:block absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-500 ease-out rounded-full"
           style={{
             width: `${100 / navigationItems.length}%`,
             transform: `translateX(${activeTabIndex * 100}%)`
           }}>
        <div className="w-full h-full bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse"></div>
      </div> */}
    </nav>
  );
}