'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import CallModal from '@/components/CallModal';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  email: string;
  name: string | null | undefined;
  imageUrl?: string | null;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setIsLoggedIn(true);
      setUserData({
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name,
        imageUrl: session.user.image,
      });
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, [session, status]);

  const handleLoginSuccess = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    setUserData(null);
  };

  const handleUpdateProfile = (data: Partial<UserData>) => {
    if (userData) {
      setUserData({ ...userData, ...data });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          // You can now send this data to your backend API
          shareLocation(latitude, longitude);
        },
        (error) => {
          alert('Unable to retrieve location. Please allow location access.');
          console.error(error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const shareLocation = async (latitude: number, longitude: number) => {
    if (!isLoggedIn) {
      alert('Please log in to share your location.');
      return;
    }
  
    try {
      const response = await fetch('/api/share-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Location shared successfully!');
      } else {
        alert(`Error sharing location: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      alert('Something went wrong while sharing your location.');
    }
  };

  const handleAlert = async () => {
        if (!isLoggedIn) {
        alert('Please log in to send an alert.');
        return;
        }
    
        // Fetch guardians' data dynamically from the API
        const response = await fetch('/api/guardians');
        const guardians = await response.json();
    
        if (guardians.length === 0) {
        alert('No guardians found!');
        return;
        }
    
        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
    
            // Now send the alert to the guardians
            const alertResponse = await fetch('/api/alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude,
                longitude,
                guardians,  // Send the dynamic guardians here
            }),
            });
    
            const data = await alertResponse.json();
    
            if (alertResponse.ok) {
            alert('Alert sent successfully!');
            } else {
            alert(`Error sending alert: ${data.error}`);
            }
        },
        (error) => {
            alert('Unable to retrieve location. Please allow location access.');
            console.error(error);
        }
        );
    };  
  const handleMakeCall = () => {
    setShowCallModal(true); // Show the modal when the "Make Call" button is clicked
  };

  const handleCloseModal = () => {
    setShowCallModal(false);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSelectOption = (option: string) => {
    // Close the modal first
    handleModalClose();

    // Redirect based on the selected option
    if (option === 'chat') {
      router.push('/chat');
    } else if (option === 'video') {
      router.push('/video-call');
    } else if (option === 'audio') {
      router.push('/audio-call');
    }
  };

// Inside your Home component
 
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMCAwaDYwdjYwSDB6IiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/50"></div>
      
      <Navbar 
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        userData={userData}
        onUpdateProfile={handleUpdateProfile}
      />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-full h-full text-red-400"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  {/* Crown base */}
                  <path d="M3 19H21L19 23H5L3 19Z" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Crown band */}
                  <path d="M5 19L7 15H17L19 19" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Main crown points */}
                  <path d="M7 15L9 11L12 15L15 11L17 15" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Center jewel */}
                  <path d="M12 15L12 17" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 16H13" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Left thorns */}
                  <path d="M9 11L8 9L9 7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 15L6 13L5 11" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Right thorns */}
                  <path d="M15 11L16 9L15 7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 15L18 13L19 11" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Side decorations */}
                  <path d="M5 19L4 17" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 19L20 17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-purple-500">
              {isLoggedIn && userData ? `Hello ${userData.name || 'User'}! I'm Rakshak` : `Hello, I'm Rakshak`}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your trusted guardian in the digital realm. Secure, protect, and defend your presence.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <motion.div
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-red-500/10 transition-all duration-300 relative group cursor-pointer"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.2,
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }}
              onClick={() => {
                if (isLoggedIn) {
                  // Handle alert sending logic here
                  handleAlert();
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-lg p-2 mb-4 shadow-lg shadow-red-500/10">
                <svg className="w-full h-full text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Alert</h3>
              <p className="text-gray-300">Send emergency alerts to your contacts with your location and status information when you're in danger.</p>
              
              {/* Button overlay that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 text-white mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">Send Alert</h3>
                  <p className="text-white/80 text-sm">
                    {isLoggedIn 
                      ? "Click to send an emergency alert" 
                      : "Sign in to send alerts"}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-red-500/10 transition-all duration-300 relative group cursor-pointer"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3,
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }}
              onClick={() => {
                if (isLoggedIn) {
                  // Handle call functionality
                  handleMakeCall();
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-lg p-2 mb-4 shadow-lg shadow-red-500/10">
                <svg className="w-full h-full text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Talk to Me</h3>
              <p className="text-gray-300">Connect with emergency services or trusted contacts through voice calls when you need immediate assistance.</p>
              
              {/* Button overlay that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 text-white mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">Make Call</h3>
                  <p className="text-white/80 text-sm">
                    {isLoggedIn 
                      ? "Click to connect with emergency services" 
                      : "Sign in to make emergency calls"}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-red-500/10 transition-all duration-300 relative group cursor-pointer"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.4,
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }}
              onClick={() => {
                if (isLoggedIn) {
                  // Handle location sharing
                  getCurrentLocation();
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-lg p-2 mb-4 shadow-lg shadow-red-500/10">
                <svg className="w-full h-full text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Share Your Location</h3>
              <p className="text-gray-300">Share your real-time location with trusted contacts or emergency services to get help when you need it most.</p>
              
              {/* Button overlay that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-purple-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4">
                  <svg className="w-12 h-12 text-white mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">Share Location</h3>
                  <p className="text-white/80 text-sm">
                    {isLoggedIn 
                      ? "Click to share your current location" 
                      : "Sign in to share your location"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {status !== 'authenticated' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-12 mb-8"
            >
              <motion.button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 px-8 rounded-lg hover:from-red-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 text-lg font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showCallModal && (
        <CallModal onClose={handleCloseModal} onSelectOption={handleSelectOption} />
      )}
    </main>
  );
} 