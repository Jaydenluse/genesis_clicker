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

  const navigate = useNavigate();
  const location = useLocation();

  const navButtons = [
    { path: '/', icon: LuHome, label: 'Home' },
    { path: '/upgrades', icon: LuArrowUpCircle, label: 'Upgrades' },
    { path: '/knowledge', icon: GiBrain, label: 'Knowledge' },
  ];

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const buyUpgrade = (upgrade) => {
    const count = upgradeCounts[upgrade.name] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
    if (stardust >= cost) {
      setStardust(prevStardust => prevStardust - cost);
      setSps(prevSps => prevSps + upgrade.sps);
      setUpgradeCounts(prev => ({ ...prev, [upgrade.name]: (prev[upgrade.name] || 0) + 1 }));
    }
  };

  return (
    <GameContext.Provider value={{ 
      stardust,
      setStardust, 
      sps,
      setSps, 
      upgradeCounts,
      setUpgradeCounts,
      clickPower,
      setClickPower,
      clickUpgradeCounts,
      setClickUpgradeCounts,
      buyUpgrade,
    }}>


      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <header className="bg-slate-950 p-6 flex justify-between items-center sticky top-0 z-40 shadow-md">
          <div className="flex items-center">
            <LuStar className="inline-block mr-2 text-yellow-400" />
            <span className="font-mp text-xl font-bold">{Math.floor(stardust)} Stardust</span>
          </div>
          <div className="flex items-center">
            <LuRocket className="inline-block mr-2 text-blue-400" />
            <span className='font-mp text-xl'>{sps.toFixed(1)} SPS</span>
          </div>
        </header>
        <main className="flex-grow overflow-auto pb-16">
          <Outlet />
        </main>


        <footer className="fixed bottom-0 left-0 right-0 bg-slate-950 p-4 shadow-inner z-50">
          <div className="flex justify-center space-x-4">
            {navButtons.map((button) => (
              <div key={button.path} className="relative group">
                <button
                  onClick={() => navigate(button.path)}
                  className={`p-2 rounded-full ${location.pathname === button.path ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition-colors`}
                  aria-label={button.label}
                >
                  <button.icon size={24} />
                </button>
                <div className="absolute font-mp bg-opacity-60 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {button.label}
                </div>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </GameContext.Provider>
  );
};

export default Layout;