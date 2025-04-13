'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLogOut } from 'react-icons/fi';

interface UserData {
  id: string;
  email: string;
  name: string | null | undefined;
  imageUrl?: string | null;
}

interface ProfileDropdownProps {
  user: UserData;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({ user, onClose, onLogout }: ProfileDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-56 rounded-xl bg-gray-800 shadow-lg border border-gray-700/50 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center border border-gray-700/50">
            {user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FiUser className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-medium truncate">{user.name || 'User'}</p>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
} 