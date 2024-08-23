import React from 'react';
import { LuX, LuShield } from 'react-icons/lu';

const DifficultyModal = ({ isOpen, onClose}) => {
  if (!isOpen) return null;

  const difficulties = [
    { name: 'Easy', multiplier: 2, color: 'text-green-400' },
    { name: 'Normal', multiplier: 1, color: 'text-blue-400' },
    { name: 'Hard', multiplier: 0.5, color: 'text-red-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400 font-mp">Choose Your Difficulty</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <LuX size={24} />
          </button>
        </div>
        <div className="bg-slate-800 p-4 rounded-md mb-6">
          <p className="text-white mb-4 font-mp">
            Select your preferred game difficulty:
          </p>
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.name}
              className={`w-full mb-2 p-2 rounded-md ${difficulty.color} hover:bg-opacity-20 bg-opacity-10 transition-colors flex items-center justify-between`}
            >
              <span className="font-mp">{difficulty.name}</span>
              <div className="flex items-center">
                <LuShield size={18} className="mr-2" />
                <span className="font-mp">x{difficulty.multiplier}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-gray-400 font-mp text-sm">
          Difficulty affects research times? SPS? Clicks per second?
        </p>
      </div>
    </div>
  );
};

export default DifficultyModal;