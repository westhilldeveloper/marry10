'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageCarousel from '@/components/ImageCarousel';
import VideoSection from '@/components/VideoSection';
import RegistrationModal from '@/components/RegistrationModal';
import SpecialtiesFloating from '@/components/SpecialtiesFloating';
import SpecialtiesMobile from '@/components/SpecialtiesMobile';

export default function HomeClient() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
    fetchNotes();
  }, []);

  const fetchProfiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'profiles'));
      const profilesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProfiles(profilesData);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const notesQuery = query(collection(db, 'notes'), orderBy('order'));
      const notesSnapshot = await getDocs(notesQuery);
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
          {/* Floating Specialties */}
      <SpecialtiesFloating />
      {/* <SpecialtiesMobile /> */}
      {/* Hero Section */}
      <section 
        className="text-center py-20 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/images/mybg.jpg)' }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/80 to-primary/40"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold text-secondary mb-6 font-serif">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-yellow-700 mb-8 font-sans">
            Join thousands of successful marriages through our trusted platform
          </p>
          <div className="font-script text-3xl text-yellow-700 mb-8">
            Where Love Stories Begin...
          </div>
          <button
            onClick={() => setShowRegistration(true)}
            className="bg-secondary text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/90 transition duration-300 font-sans shadow-lg border-2 border-primary/30"
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Notes Section - Modern Style */}
      {notes.length > 0 && (
        <section className="py-16 bg-white" style={{ backgroundImage: 'url(/images/hrtlock.jpg)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-pink-800 mb-4 font-serif">
                Why Choose Us?
              </h2>
              <div className="w-24 h-1 bg-pink-500 mx-auto mb-6"></div>
              <p className="text-lg text-yellow-600 max-w-2xl mx-auto font-sans">
                Discover what makes us the trusted choice for finding your life partner
              </p>
            </div>

            {/* Modern Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
              {notes.map((note, index) => (
                <div 
                  key={note.id}
                  className="relative group"
                >
                  {/* Animated Card */}
                  <div className="bg-gradient-to-br from-primary/30 to-primary/90 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                    {/* Note Content */}
                    <div className="flex-1">
                      <h3 className="text-xl text-secondary font-bold text-gray-800 mb-4 font-serif pt-2">
                        {note.heading}
                      </h3>
                      <p className="text-yellow-800 leading-relaxed font-sans">
                        {note.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition duration-300 font-sans shadow-lg"
              >
                Start Your Journey Today
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Profiles Preview Section */}
      {profiles.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-secondary/20 to-primary/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-pink-800 mb-4 font-serif">
                Featured Profiles
              </h2>
              <div className="w-24 h-1 bg-pink-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
                Meet some of our registered members looking for their perfect match
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.slice(0, 6).map((profile) => (
                <div key={profile.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">
                        {profile.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 font-serif">{profile.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 font-sans">{profile.profession}</p>
                    <p className="text-primary text-sm mt-2 font-sans">{profile.age} years • {profile.religion}</p>
                  </div>
                </div>
              ))}
            </div>

            {profiles.length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowRegistration(true)}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 font-sans"
                >
                  View More Profiles
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Image Carousel */}
      <section className="py-16 bg-gradient-to-r from-primary/30 to-primary/90 border-1 border-secondary/10 m-4 rounded-lg bg-[length:100%_auto] " style={{ backgroundImage: 'url(/images/pinkbg.jpg)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-yellow-400 mb-12 font-serif">
            Success Stories
          </h2>
          <ImageCarousel />
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white" style={{ backgroundImage: 'url(/images/hrtlock.jpg)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-pink-800 mb-12 font-serif">
            Featured Videos
          </h2>
          <VideoSection />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/30 through-primary to-primary/80">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-secondary mb-8 font-sans">
            Join our community today and start your journey to finding true love
          </p>
          <button
            onClick={() => setShowRegistration(true)}
            className="bg-secondary text-primary px-8 py-4 rounded-lg text-xl font-semibold hover:bg-secondary/90 transition duration-300 font-sans shadow-lg border-2 border-primary/30"
          >
            Register Free Today
          </button>
          <p className="text-secondary/80 mt-4 font-sans">
            No hidden fees • Verified profiles • 100% secure
          </p>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <RegistrationModal onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
}