'use client';

import React, { useState } from 'react';
import { FaVideo, FaPlayCircle } from 'react-icons/fa';

const videos = [
  { id: 'TKoWbGuRmKQ', title: 'Emergency Tips - 1' },
  { id: 'hC_5tzIYvqo', title: 'Quick Response Hacks' },
  { id: 'sT4EWIz061Q', title: 'Safety Essentials Guide' },
];

export default function VideoCallPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-10">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 leading-tight pb-2">
        <span className="flex items-center justify-center gap-3">
          <FaVideo className="text-5xl drop-shadow-lg" />
          Emergency Video Help
        </span>
      </h1>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {videos.map((video) => (
          <div
            key={video.id}
            className="cursor-pointer transition-transform transform hover:scale-105 group"
            onClick={() => setSelectedVideo(video.id)}
          >
            <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover blur-sm brightness-50 transition"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <FaPlayCircle className="text-6xl text-white drop-shadow-lg hover:scale-110 transition-transform duration-200" />
                <span className="mt-2 text-white text-sm font-medium tracking-wide">
                  Click to Play
                </span>
              </div>
            </div>
            <p className="text-center mt-2 text-gray-300">{video.title}</p>
          </div>
        ))}
      </div>

      {/* Enlarged Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="Selected Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <div className="p-4 text-center">
              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-4 px-5 py-2 rounded bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="text-center mt-10">
  <a
    href="/"
    className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition font-medium shadow-md"
  >
    ⬅ Back to Home
  </a>
</div>
    </div>
  );
}