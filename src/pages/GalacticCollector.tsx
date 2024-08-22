import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowCircleRight, MdImage } from "react-icons/md";
import { useGameContext } from '../components/Layout';
import stars from '../images/stars.gif';
import planet from '../images/planet.gif';
import collector from '../images/better-collector.png'
import magnet from '../images/magnet.png'
import harvester from '../images/harvester.png'

const GalacticCollector = () => {
  const { stardust, setStardust, clickPower, setClickPower, clickUpgradeCounts, setClickUpgradeCounts } = useGameContext();
  const [surgeActive, setSurgeActive] = useState(false);
  const [clickEffects, setClickEffects] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const tooltipTimeoutRef = useRef(null);

  const clickUpgrades = [
    { name: 'Better Collector', power: 1, baseCost: 10, image: collector },
    { name: 'Stardust Magnet', power: 5, baseCost: 100, image: magnet },
    { name: 'Quantum Harvester', power: 20, baseCost: 1000, image: harvester },
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

  const handleMouseEnter = useCallback((upgrade) => {
    clearTimeout(tooltipTimeoutRef.current);
    setTooltipVisible(upgrade.name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipVisible(null);
    }, 300); // 300ms delay before hiding tooltip
  }, []);

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


      {/* Clicker Upgrades and Tooltip */}
      <div className="w-64 bg-slate-950 p-4 font-mp flex flex-col relative">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Click Upgrades</h2>
        <div className="grid grid-cols-2 gap-4">
          {clickUpgrades.map((upgrade) => {
            const count = clickUpgradeCounts[upgrade.name];
            const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
            return (
              <div 
                key={upgrade.name} 
                className="relative group flex justify-center items-center"
                onMouseEnter={() => handleMouseEnter(upgrade)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => buyClickUpgrade(upgrade)}
                  className="w-24 h-24 mt-2 rounded overflow-hidden focus:outline-none relative z-10"
                  disabled={stardust < cost}
                >
                    <img 
                      src={upgrade.image} 
                      alt={upgrade.name} 
                      className="w-full h-full object-cover object-center"
                    /> 
                </button>
                <div className="absolute border border-sky-500 inset-0 h-28 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded"></div>
              </div>
            );
          })}
        </div>

        {/* Tooltip Container */}
        <div 
          className={`absolute right-full top-0 m-2 w-48 bg-gray-800 p-2 rounded shadow-lg transition-all duration-200 ease-in-out ${
            tooltipVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onMouseEnter={() => clearTimeout(tooltipTimeoutRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          {clickUpgrades.map((upgrade) => {
            if (upgrade.name === tooltipVisible) {
              const count = clickUpgradeCounts[upgrade.name];
              const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
              return (
                <div key={upgrade.name} className="text-white">
                  <h3 className="text-lg font-semibold">{upgrade.name}</h3>
                  <p className="text-sm">Power: +{upgrade.power}</p>
                  <p className="text-sm">Cost: {cost} Stardust</p>
                  <p className="text-sm">Owned: {count}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default GalacticCollector;