'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import { FiMenu, FiX, FiLogOut, FiUser, FiShield } from 'react-icons/fi';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface UserData {
  id: string;
  email: string;
  name: string | null | undefined;
  imageUrl?: string | null;
}

interface NavbarProps {
  onLoginClick: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  userData: UserData | null;
  onUpdateProfile?: (data: Partial<UserData>) => void;
}

export default function Navbar({ onLoginClick, onLogout, isLoggedIn, userData, onUpdateProfile }: NavbarProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleUpdateProfile = (data: Partial<UserData>) => {
    if (onUpdateProfile) {
      onUpdateProfile(data);
    }
  };

  // Use session status to determine if user is logged in
  const isAuthenticated = status === 'authenticated';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled 
          ? 'bg-gray-900/80 backdrop-blur-md' 
          : 'bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 mr-2">
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
            </motion.div>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
          {isAuthenticated && (
            <Link 
            href="/shop" 
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >Shop</Link>
          )}
            {isAuthenticated && (
              <Link 
                href="/guardians" 
                className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FiShield className="text-xl" />
                <span>My Guardians</span>
              </Link>
            )}
          </div>
          
          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:ml-auto">
            {!isAuthenticated ? (
              <motion.button
                onClick={onLoginClick}
                className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            ) : (
              <div className="flex items-center">
                {/* Profile Icon */}
                <div ref={profileRef} className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center cursor-pointer border border-gray-700/50 shadow-lg shadow-red-500/10 overflow-hidden"
                    onClick={handleProfileClick}
                  >
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg 
                        className="w-6 h-6 text-red-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                    )}
                  </motion.div>
                  
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <ProfileDropdown 
                        user={{
                          id: session?.user?.id as string || '',
                          email: session?.user?.email as string || '',
                          name: session?.user?.name,
                          imageUrl: session?.user?.image
                        }}
                        onClose={() => setShowProfileDropdown(false)}
                        onLogout={onLogout}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800"
      >
        <div className="px-4 py-4 space-y-4">
          {isAuthenticated ? (
            <>
              <Link 
                href="/guardians" 
                className="block text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShield className="text-xl" />
                <span>My Guardians</span>
              </Link>
              <div className="flex items-center space-x-3 text-gray-300">
                <FiUser className="h-5 w-5" />
                <span>{session?.user?.name || 'User'}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/20"
              >
                <FiLogOut className="text-xl" />
                Logout
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLoginClick}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-red-500/20"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
} 