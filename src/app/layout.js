import './globals.css';
import { Cormorant_Garamond, Sacramento, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';


const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

// Beautiful script
const sacramento = Sacramento({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sacramento',
});
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Matrimony Website - Find Your Perfect Match',
  description: 'A modern matrimony platform to find your life partner',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cormorant.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}



function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Matrimony</h3>
            <p className="text-gray-300">
              Find your perfect life partner with our modern matrimony platform. 
              Trusted by thousands of families for genuine matches.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-secondary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-primary transition-colors">About</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/admin" className="text-gray-300 hover:text-primary transition-colors">Admin</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-secondary mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@matrimony.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Match Street, City</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-300">
            &copy; 2024 Matrimony Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}