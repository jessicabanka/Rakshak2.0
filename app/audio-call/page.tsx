'use client';

import React, { useRef } from 'react';
import { FaHeadphones } from 'react-icons/fa';

const audioFiles = [
  { name: 'Call 1', src: 'audio/call1.mp3' },
  { name: 'Call 2', src: 'audio/call2.mp3' },
];

export default function AudioCallPage() {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]); // Reference array for audio elements

  // Function to handle audio play/pause
  const handleAudioPlay = (index: number) => {
    // Stop all other audio tracks
    audioRefs.current.forEach((audio, i) => {
      if (i !== index) {
        audio?.pause();
        audio.currentTime = 0; // Reset the audio to the beginning
      }
    });

    // Play the selected audio
    if (audioRefs.current[index]) {
      audioRefs.current[index]?.play();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 leading-tight pb-2">
        <span className="flex items-center justify-center gap-3">
          <FaHeadphones className="text-5xl drop-shadow-lg" />
          Emergency Audio Messages
        </span>
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {audioFiles.map((audio, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-4">{audio.name}</h2>
            <audio
              ref={(el) => (audioRefs.current[index] = el)} // Save reference to the audio element
              controls
              className="w-full"
              onPlay={() => handleAudioPlay(index)} // Handle audio play event
            >
              <source src={audio.src} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
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