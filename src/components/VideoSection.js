'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function VideoSection() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const videosData = querySnapshot.docs.map(doc => doc.data());
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <video
            controls
            className="w-full h-48 object-cover"
            poster={video.thumbnailUrl}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800">{video.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}