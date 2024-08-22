import React, { createContext, useState, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LuStar, LuRocket } from 'react-icons/lu';

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
    // localStorage.clear(); Use this to start testing from 0
  }, [stardust, sps, upgradeCounts, clickPower, clickUpgradeCounts]);

  return (
    <GameContext.Provider value={{ 
      stardust, setStardust, 
      sps, setSps, 
      upgradeCounts, setUpgradeCounts,
      clickPower, setClickPower,
      clickUpgradeCounts, setClickUpgradeCounts
    }}>
      <div className="min-h-screen bg-slate-950 text-white">
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
        <main>
          <Outlet />
        </main>
      </div>
    </GameContext.Provider>
  );
};

export default Layout;