import React from 'react';
import { LuX, LuStar, LuBrain } from 'react-icons/lu';

const Modal = ({ isOpen, onClose, title, content, icon, value, subtext, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400 font-mp">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <LuX size={24} />
          </button>
        </div>
        <div className="bg-slate-800 p-4 rounded-md mb-6">
          <p className="text-white mb-4 font-mp text-center">
            {content}
          </p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {icon === 'star' && <LuStar className="text-yellow-400" size={24} />}
              {icon === 'brain' && <LuBrain className="text-purple-400" size={48} />}
              <p className="text-3xl font-bold text-yellow-400 font-mp">
                {value}
              </p>
            </div>
          {subtext && <p className="text-center text-blue-300 font-mp">{subtext}</p>}
        </div>
        {actionText && (
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-center font-mp"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;