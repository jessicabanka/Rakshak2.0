'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiUser, FiPhone, FiUsers } from 'react-icons/fi';

interface Guardian {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  isActive: boolean;
}

export default function GuardiansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuardian, setNewGuardian] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
  });
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchGuardians();
    }
  }, [status, router]);

  const fetchGuardians = async () => {
    try {
      setIsLoading(true);
      console.log("Session Status:", status);
      const response = await fetch('/api/guardians', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch guardians');
      }
      
      const data = await response.json();
      setGuardians(data);
    } catch (err) {
      setError('Failed to load guardians. Please try again later.');
      console.error('Error fetching guardians:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuardian = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Session Status:", status);
    console.log("Session Data:", session);

    try {
      const response = await fetch('/api/guardians', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGuardian),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        throw new Error(errorData.error || 'Failed to add guardian');
      }
      
      const data = await response.json();
      setGuardians([...guardians, data]);
      setShowAddForm(false);
      setNewGuardian({ name: '', email: '', phone: '', relationship: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guardian');
    }
  };

  const handleDeleteGuardian = async (id: string) => {
    if (!confirm('Are you sure you want to remove this guardian?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/guardians/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete guardian');
      }
      
      setGuardians(guardians.filter(guardian => guardian.id !== id));
    } catch (err) {
      setError('Failed to delete guardian. Please try again later.');
    }
  };

  const handleUpdateGuardian = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingGuardian) return;
    
    try {
      const response = await fetch(`/api/guardians/${editingGuardian.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingGuardian.name,
          email: editingGuardian.email,
          phone: editingGuardian.phone,
          relationship: editingGuardian.relationship,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update guardian');
      }
      
      const updatedGuardian = await response.json();
      setGuardians(guardians.map(g => g.id === updatedGuardian.id ? updatedGuardian : g));
      setEditingGuardian(null);
    } catch (err) {
      setError('Failed to update guardian. Please try again later.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Guardians</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FiPlus className="text-xl" />
              <span>Add Guardian</span>
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : guardians.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center">
            <FiUsers className="text-5xl text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">No Guardians Added</h2>
            <p className="text-gray-400 mb-4">Add guardians to notify them in case of emergencies.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <FiPlus className="text-xl" />
              <span>Add Your First Guardian</span>
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {guardians.map((guardian) => (
              <motion.div
                key={guardian.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{guardian.name}</h3>
                    <p className="text-gray-400 mb-2">{guardian.relationship}</p>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p>{guardian.email}</p>
                      <p>{guardian.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      guardian.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {guardian.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => setEditingGuardian(guardian)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteGuardian(guardian.id)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Guardian Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Add New Guardian</h2>
              <form onSubmit={handleAddGuardian}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newGuardian.name}
                    onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newGuardian.email}
                    onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newGuardian.phone}
                    onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <input
                    type="text"
                    value={newGuardian.relationship}
                    onChange={(e) => setNewGuardian({ ...newGuardian, relationship: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Guardian
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Guardian Modal */}
        {editingGuardian && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Edit Guardian</h2>
              <form onSubmit={handleUpdateGuardian}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editingGuardian.name}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editingGuardian.email}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, email: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingGuardian.phone}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, phone: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <input
                    type="text"
                    value={editingGuardian.relationship}
                    onChange={(e) => setEditingGuardian({ ...editingGuardian, relationship: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingGuardian(null)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    Update Guardian
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 