'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Upload states
  const [imageUpload, setImageUpload] = useState(null);
  const [videoUpload, setVideoUpload] = useState(null);
  const [videoData, setVideoData] = useState({
    title: '',
    description: ''
  });

  // Notes state
  const [noteData, setNoteData] = useState({
    heading: '',
    description: '',
    order: 0
  });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMedia();
      fetchNotes();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        loginData.email, 
        loginData.password
      );
      setUser(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchMedia = async () => {
    try {
      const imagesSnapshot = await getDocs(collection(db, 'carouselImages'));
      const imagesData = imagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imagesData);

      const videosSnapshot = await getDocs(collection(db, 'videos'));
      const videosData = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const notesSnapshot = await getDocs(collection(db, 'notes'));
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort notes by order
      notesData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!imageUpload) return;

    setLoading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(imageUpload);

      // Save Cloudinary URL to Firestore
      await addDoc(collection(db, 'carouselImages'), {
        imageUrl: imageUrl,
        createdAt: new Date()
      });

      alert('Image uploaded successfully!');
      setImageUpload(null);
      fetchMedia();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Image upload failed: ${error.message}`);
    }
    setLoading(false);
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    if (!videoUpload) return;

    setLoading(true);
    try {
      // Upload to Cloudinary
      const videoUrl = await uploadToCloudinary(videoUpload);

      // Save Cloudinary URL to Firestore
      await addDoc(collection(db, 'videos'), {
        videoUrl: videoUrl,
        title: videoData.title,
        description: videoData.description,
        createdAt: new Date()
      });

      alert('Video uploaded successfully!');
      setVideoUpload(null);
      setVideoData({ title: '', description: '' });
      fetchMedia();
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(`Video upload failed: ${error.message}`);
    }
    setLoading(false);
  };

  const saveNote = async (e) => {
  e.preventDefault();
  if (!noteData.heading || !noteData.description) {
    alert('Please fill in both heading and description');
    return;
  }

  setLoading(true);
  try {
    if (editingNote) {
      // Update existing note
      console.log('Updating note:', editingNote.id);
      await updateDoc(doc(db, 'notes', editingNote.id), {
        heading: noteData.heading,
        description: noteData.description,
        order: parseInt(noteData.order) || 0,
        updatedAt: new Date()
      });
      alert('Note updated successfully!');
    } else {
      // Create new note
      console.log('Creating new note');
      await addDoc(collection(db, 'notes'), {
        heading: noteData.heading,
        description: noteData.description,
        order: parseInt(noteData.order) || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      alert('Note added successfully!');
    }

    setNoteData({ heading: '', description: '', order: 0 });
    setEditingNote(null);
    fetchNotes();
  } catch (error) {
    console.error('Error saving note:', error);
    
    // More specific error messages
    if (error.code === 'permission-denied') {
      alert('Permission denied. Check your Firestore security rules.');
    } else if (error.code === 'not-found') {
      alert('Firestore collection not found.');
    } else if (error.code === 'unauthenticated') {
      alert('Please sign in to save notes.');
    } else {
      alert(`Failed to save note: ${error.message}`);
    }
  }
  setLoading(false);
};

  const editNote = (note) => {
    setEditingNote(note);
    setNoteData({
      heading: note.heading,
      description: note.description,
      order: note.order || 0
    });
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setNoteData({ heading: '', description: '', order: 0 });
  };

  const deleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteDoc(doc(db, 'notes', noteId));
      fetchNotes();
      alert('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note.');
    }
  };

  const deleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteDoc(doc(db, 'carouselImages', imageId));
      fetchMedia();
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await deleteDoc(doc(db, 'videos', videoId));
      fetchMedia();
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Admin Email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'images' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Manage Images
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'videos' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Manage Videos
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'notes' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Manage Notes
          </button>
        </div>

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Upload Carousel Image</h2>
            <form onSubmit={uploadImage} className="space-y-4 mb-8">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageUpload(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={loading || !imageUpload}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>

            <h3 className="text-xl font-semibold mb-4">Current Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden relative group">
                  <img
                    src={image.imageUrl}
                    alt={`Carousel ${image.id}`}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>
            <form onSubmit={uploadVideo} className="space-y-4 mb-8">
              <input
                type="text"
                placeholder="Video Title"
                value={videoData.title}
                onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <textarea
                placeholder="Video Description"
                value={videoData.description}
                onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                required
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoUpload(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={loading || !videoUpload}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Video'}
              </button>
            </form>

            <h3 className="text-xl font-semibold mb-4">Current Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="border rounded-lg overflow-hidden relative group">
                  <video
                    controls
                    className="w-full h-48 object-cover"
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="p-4">
                    <h4 className="font-semibold">{video.title}</h4>
                    <p className="text-gray-600 text-sm">{video.description}</p>
                  </div>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h2>
            <form onSubmit={saveNote} className="space-y-4 mb-8">
              <input
                type="text"
                placeholder="Note Heading"
                value={noteData.heading}
                onChange={(e) => setNoteData({...noteData, heading: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <textarea
                placeholder="Note Description"
                value={noteData.description}
                onChange={(e) => setNoteData({...noteData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                required
              />
              <input
                type="number"
                placeholder="Display Order (optional)"
                value={noteData.order}
                onChange={(e) => setNoteData({...noteData, order: parseInt(e.target.value) || 0})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                min="0"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingNote ? 'Update Note' : 'Add Note')}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h3 className="text-xl font-semibold mb-4">Current Notes</h3>
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border rounded-lg p-4 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{note.heading}</h4>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editNote(note)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">{note.description}</p>
                  {note.order > 0 && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      Order: {note.order}
                    </span>
                  )}
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-gray-500 text-center py-8">No notes added yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}