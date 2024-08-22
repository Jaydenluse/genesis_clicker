import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { useGameContext } from '../components/Layout';
import stars from '../images/stars.gif';
import planet from '../images/planet.gif';

const GalacticCollector = () => {
  const { stardust, setStardust, clickPower, setClickPower, clickUpgradeCounts, setClickUpgradeCounts } = useGameContext();
  const [surgeActive, setSurgeActive] = useState(false);
  const [clickEffects, setClickEffects] = useState([]);
  const clickUpgrades = [
    { name: 'Better Collector', power: 1, baseCost: 10 },
    { name: 'Stardust Magnet', power: 5, baseCost: 100 },
    { name: 'Quantum Harvester', power: 20, baseCost: 1000 },
  ];

  const collectStardust = (e) => {
    const collected = surgeActive ? clickPower * 5 : clickPower;
    setStardust(prevStardust => prevStardust + collected);

    // Create click effect
    const newEffect = {
      id: Date.now(),
      value: collected,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    setClickEffects(prev => [...prev, newEffect]);

    // Remove effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
  };

  const buyClickUpgrade = (upgrade) => {
    const count = clickUpgradeCounts[upgrade.name];
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
    if (stardust >= cost) {
      setStardust(prevStardust => prevStardust - cost);
      setClickUpgradeCounts(prev => ({
        ...prev,
        [upgrade.name]: prev[upgrade.name] + 1
      }));
      setClickPower(prevPower => prevPower + upgrade.power);
    }
  };

  return (
    <div className="height flex">
      <div className="flex-grow flex flex-col relative">
        <div className="flex-grow relative overflow-hidden bg-black">
          {/* Background stars GIF */}
          <div 
            className="absolute inset-0 rounded"
            style={{ 
              backgroundImage: `url(${stars})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Clickable planet */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={collectStardust}
              className="w-[480px] h-[480px] rounded-full overflow-hidden focus:outline-none clicker"
              style={{ 
                backgroundImage: `url(${planet})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
          
          {/* Click effects */}
          {clickEffects.map(effect => (
            <div
              key={effect.id}
              className="absolute pointer-events-none text-slate-950 font-bold text-2xl font-mp"
              style={{
                left: `calc(50% + ${effect.x - 240}px)`,
                top: `calc(50% + ${effect.y - 260}px)`,
                animation: 'float-up 1s ease-out',
                opacity: 0,
              }}
            >
              +{effect.value}
            </div>
          ))}
        </div>

        {/* Upgrades Arrow Link with Tooltip */}
        <div className="absolute bottom-4 right-4 z-50">
          <div className="group relative">
            <Link 
              to="/upgrades" 
              className="inline-block text-white hover:text-light-blue transition-all duration-300 ease-in-out transform hover:translate-x-1"
              aria-label="View Upgrades"
            >
              <MdOutlineArrowCircleRight size={32} />
            </Link>
          </div>
        </div>
      </div>


      {/* Clicker Upgrades */}
      <div className="w-64 bg-slate-950 p-4 overflow-y-auto font-mp">
        <h2 className="text-2xl font-bold mb-4 text-white">Click Upgrades</h2>
        {clickUpgrades.map((upgrade) => {
          const count = clickUpgradeCounts[upgrade.name];
          const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
          return (
            <div key={upgrade.name} className="mb-4 bg-gray-700 p-2 rounded">
              <h3 className="text-lg font-semibold text-white">{upgrade.name}</h3>
              <p className="text-sm text-gray-300">Power: +{upgrade.power}</p>
              <p className="text-sm text-gray-300">Cost: {cost} Stardust</p>
              <p className="text-sm text-gray-300">Owned: {count}</p>
              <button
                onClick={() => buyClickUpgrade(upgrade)}
                disabled={stardust < cost}
                className="mt-2 w-full py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Buy
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalacticCollector;