import React, { createContext, useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LuStar, LuRocket, LuHome, LuArrowUpCircle } from 'react-icons/lu';
import { GiBrain } from "react-icons/gi";

const GameContext = createContext(null);

export const useGameContext = () => useContext(GameContext);

const Layout = () => {
  const [stardust, setStardust] = useState(() => {
    const saved = localStorage.getItem('stardust');
    return saved ? parseFloat(saved) : 0;
  });
  const [sps, setSps] = useState(() => {
    const saved = localStorage.getItem('sps');
    return saved ? parseFloat(saved) : 0;
  });
  const [upgradeCounts, setUpgradeCounts] = useState(() => {
    const saved = localStorage.getItem('upgradeCounts');
    return saved ? JSON.parse(saved) : { 'Amino Acids': 0, 'Nucleotides': 0, 'Lipids': 0 };
  });
  const [clickPower, setClickPower] = useState(() => {
    const saved = localStorage.getItem('clickPower');
    return saved ? parseInt(saved) : 1;
  });
  const [clickUpgradeCounts, setClickUpgradeCounts] = useState(() => {
    const saved = localStorage.getItem('clickUpgradeCounts');
    return saved ? JSON.parse(saved) : { 'Better Collector': 0, 'Stardust Magnet': 0, 'Quantum Harvester': 0 };
  });

  const [localStardust, setLocalStardust] = useState(stardust);

  const buyUpgrade = (upgrade) => {
    const count = upgradeCounts[upgrade.name] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
    if (localStardust >= cost) {
      setLocalStardust(prev => prev - cost);
      setSps(prev => prev + upgrade.sps);
      setUpgradeCounts(prev => ({ ...prev, [upgrade.name]: (prev[upgrade.name] || 0) + 1 }));
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setStardust(prevStardust => prevStardust + sps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [sps]);

  useEffect(() => {
    localStorage.setItem('stardust', stardust.toString());
    localStorage.setItem('sps', sps.toString());
    localStorage.setItem('upgradeCounts', JSON.stringify(upgradeCounts));
    localStorage.setItem('clickPower', clickPower.toString());
    localStorage.setItem('clickUpgradeCounts', JSON.stringify(clickUpgradeCounts));
  }, [stardust, sps, upgradeCounts, clickPower, clickUpgradeCounts]);

  return (
    <GameContext.Provider value={{ 
      stardust, setStardust, 
      sps, setSps, 
      upgradeCounts, setUpgradeCounts,
      clickPower, setClickPower,
      clickUpgradeCounts, setClickUpgradeCounts,
      localStardust,
      setLocalStardust,
      buyUpgrade,
    }}>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <header className="bg-slate-950 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <LuStar className="inline-block mr-2 text-yellow-400" />
            <span className="font-mp text-xl font-bold">{Math.floor(stardust)} Stardust</span>
          </div>
          <div className="flex items-center">
            <LuRocket className="inline-block mr-2 text-blue-400" />
            <span className='font-mp text-xl'>{sps.toFixed(1)} SPS</span>
          </div>
        </header>
        <main className="flex-grow relative">
          <Outlet />
        </main>
        <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
          <button
            onClick={() => navigate('/')}
            className={`p-2 rounded-full ${location.pathname === '/' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
            aria-label="Home"
          >
            <LuHome size={24} />
          </button>
          <button
            onClick={() => navigate('/upgrades')}
            className={`p-2 rounded-full ${location.pathname === '/upgrades' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
            aria-label="Upgrades"
          >
            <LuArrowUpCircle size={24} />
          </button>
          <button
            onClick={() => navigate('/skills')}
            className={`p-2 rounded-full ${location.pathname === '/skills' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
            aria-label="Skills"
          >
            <GiBrain size={24} />
          </button>
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default Layout;