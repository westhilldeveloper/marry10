export default function About() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          About Us
        </h1>
        
        <div className="space-y-6 text-lg text-gray-600">
          <p>
            Welcome to our matrimony platform, where we believe in creating 
            meaningful connections that lead to lifelong partnerships. 
            Our mission is to help you find your perfect match through 
            a trusted and secure platform.
          </p>
          
          <p>
            With years of experience in matchmaking, we understand the 
            importance of compatibility, shared values, and mutual respect 
            in a successful marriage. Our platform is designed to make 
            your search for a life partner easy, safe, and effective.
          </p>
          
          <div className="bg-pink-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Verified profiles for your safety</li>
              <li>Advanced matching algorithms</li>
              <li>Privacy-focused approach</li>
              <li>Dedicated customer support</li>
              <li>Success stories from thousands of happy couples</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}