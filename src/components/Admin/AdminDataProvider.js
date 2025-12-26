// This is a server component that fetches data
import { auth, db } from '@/lib/firebase-admin'; // You'll need a firebase-admin setup
import { collection, getDocs } from 'firebase-admin/firestore';

export async function getMediaData() {
  try {
    // Fetch images
    const imagesSnapshot = await getDocs(collection(db, 'carouselImages'));
    const images = imagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch videos
    const videosSnapshot = await getDocs(collection(db, 'videos'));
    const videos = videosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch notes
    const notesSnapshot = await getDocs(collection(db, 'notes'));
    const notes = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => (a.order || 0) - (b.order || 0));

    return { images, videos, notes };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { images: [], videos: [], notes: [], error: error.message };
  }
}

// Optional: If you want to make this a component
export default async function AdminDataProvider({ children }) {
  const data = await getMediaData();
  
  // You can pass data as props or context
  return children;
}