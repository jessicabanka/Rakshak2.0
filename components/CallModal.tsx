// components/CallModal.tsx

import { FC } from 'react';

interface CallModalProps {
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

const CallModal: FC<CallModalProps> = ({ onClose, onSelectOption }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full sm:w-96 max-w-lg p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-white">Choose an Option</h2>

        <div className="space-y-4">
          {/* Chat Button */}
          <button
            onClick={() => onSelectOption('chat')}
            className="w-full bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition"
          >
            Talk via Chat (Chat Bot)
          </button>

          {/* Video Call Button */}
          <button
            onClick={() => onSelectOption('video')}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Video Call
          </button>

          {/* Audio Call Button */}
          <button
            onClick={() => onSelectOption('audio')}
            className="w-full bg-red-700 text-white p-3 rounded-lg hover:bg-red-800 transition"
          >
            Audio Call
          </button>
        </div>

        {/* Close Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-200 hover:text-gray-400 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;