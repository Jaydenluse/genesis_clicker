import React from 'react';
import { LuX, LuStar } from 'react-icons/lu';

const OfflineProgressModal = ({ isOpen, onClose, offlineStardust }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400 font-mp">Welcome Back!</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <LuX size={24} />
          </button>
        </div>
        <div className="bg-slate-800 p-4 rounded-md mb-6">
          <p className="text-white mb-2 font-mp">
            While you were away, you collected:
          </p>
          <div className="flex items-center justify-center space-x-2">
            <LuStar className="text-yellow-400" size={24} />
            <p className="text-3xl font-bold text-yellow-400 font-mp">
              {offlineStardust.toFixed(2)}
            </p>
          </div>
          <p className="text-center text-blue-300 font-mp mt-2">Stardust</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineProgressModal;