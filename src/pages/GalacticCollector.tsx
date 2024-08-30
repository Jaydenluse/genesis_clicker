import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu';
import { useGameContext } from '../components/Layout';
import { stars, collector, magnet, harvester, organism, atp } from '../public/images';

const GalacticCollector = () => {
  const { stardust, setStardust, clickPower, setClickPower, clickUpgradeCounts, setClickUpgradeCounts } = useGameContext();
  const [surgeActive, setSurgeActive] = useState(false);
  const [clickEffects, setClickEffects] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [upgradesExpanded, setUpgradesExpanded] = useState(true);
  const tooltipTimeoutRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // percentage of screen width/height
  const [isMoving, setIsMoving] = useState({ up: false, down: false, left: false, right: false });
  const positionRef = useRef(position);
  const [atpMolecules, setAtpMolecules] = useState([]);
  const organismSize = { width: 120, height: 120 };
  const atpSize = { width: 40, height: 40 };
  const MAX_ATP_MOLECULES = 5;

  const clickUpgrades = [
    { name: 'Better Collector', power: 1, baseCost: 10, image: collector },
    { name: 'Stardust Magnet', power: 5, baseCost: 100, image: magnet },
    { name: 'Quantum Harvester', power: 20, baseCost: 1000, image: harvester },
  ];

  const createATPMolecule = () => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
  });

  useEffect(() => {
    // Initialize ATP molecules
    setAtpMolecules(Array.from({ length: MAX_ATP_MOLECULES }, createATPMolecule));
  }, []);

  useEffect(() => {
    const moveATP = () => {
      setAtpMolecules(prev => prev.map(mol => ({
        ...mol,
        x: (mol.x + mol.dx + 100) % 100,
        y: (mol.y + mol.dy + 100) % 100,
      })));
    };

    const checkCollisions = () => {
      let collectedCount = 0;
      setAtpMolecules(prev => {
        const updatedMolecules = prev.map(mol => {
          const dx = mol.x - position.x;
          const dy = mol.y - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (organismSize.width / 2 + atpSize.width / 2) / 100 * Math.min(window.innerWidth, window.innerHeight)) {
            collectedCount++;
            return createATPMolecule(); // Spawn a new molecule at a random position
          }
          return mol;
        });

        return updatedMolecules;
      });

      if (collectedCount > 0) {
        collectStardust(null, collectedCount * 10); // Collect 10 stardust for each ATP
      }
    };

    const gameLoop = setInterval(() => {
      moveATP();
      checkCollisions();
    }, 50);

    return () => clearInterval(gameLoop);
  }, [position]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setIsMoving(prev => ({ ...prev, up: true }));
          break;
        case 'ArrowDown':
          setIsMoving(prev => ({ ...prev, down: true }));
          break;
        case 'ArrowLeft':
          setIsMoving(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
          setIsMoving(prev => ({ ...prev, right: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setIsMoving(prev => ({ ...prev, up: false }));
          break;
        case 'ArrowDown':
          setIsMoving(prev => ({ ...prev, down: false }));
          break;
        case 'ArrowLeft':
          setIsMoving(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
          setIsMoving(prev => ({ ...prev, right: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        const step = 0.5;
        let newX = prev.x;
        let newY = prev.y;
        if (isMoving.up) newY = Math.max(0, prev.y - step);
        if (isMoving.down) newY = Math.min(100, prev.y + step);
        if (isMoving.left) newX = Math.max(0, prev.x - step);
        if (isMoving.right) newX = Math.min(100, prev.x + step);
        return { x: newX, y: newY };
      });
    }, 75); //Can use this to upgrade speed later

    return () => clearInterval(moveInterval);
  }, [isMoving]);

  const collectStardust = (e, amount = null) => {
    const collected = amount !== null ? amount : (surgeActive ? clickPower * 5 : clickPower);
    setStardust(prevStardust => prevStardust + collected);

    // Create click effect only for mouse events
    if (e && e.nativeEvent) {
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
    }
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

  const toggleUpgrades = () => {
    setUpgradesExpanded(prev => !prev);
  };

  return (
    <div className="height flex relative overflow-hidden">
      {/* Background stars */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${stars})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Main content area */}
      <div className="flex-grow flex items-center justify-center relative z-10">
        {/* Organism */}
        <button
          onClick={(e) => collectStardust(e)}
          className="w-[120px] h-[120px] rounded-full overflow-hidden focus:outline-none clicker shake absolute"
          style={{ 
            backgroundImage: `url(${organism})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* ATP Molecules */}
        {atpMolecules.map(mol => (
          <div
            key={mol.id}
            className="absolute"
            style={{
              backgroundImage: `url(${atp})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              width: `${atpSize.width}px`,
              height: `${atpSize.height}px`,
              left: `${mol.x}%`,
              top: `${mol.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      
      {/* Upgrades panel */}
      <div className={`absolute top-0 bottom-0 flex items-stretch transition-all duration-300 ease-in-out ${
        upgradesExpanded ? 'right-0' : 'right-[-256px]'
      }`}>
        {/* Toggle button */}
        <button 
          onClick={toggleUpgrades}
          className="bg-slate-950 px-2 focus:outline-none z-30 flex items-center opacity-90"
        >
          {upgradesExpanded ? <LuChevronRight size={24} /> : <LuChevronLeft size={24} />}
        </button>

        {/* Upgrades content */}
        <div className="w-64 bg-slate-950 bg-opacity-80 p-4 font-mp flex flex-col">
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
        </div>

        {/* Tooltip */}
        {tooltipVisible && (
          <div 
            className="absolute left-[-200px] top-0 w-48 bg-gray-800 p-2 rounded shadow-lg transition-all duration-200 ease-in-out opacity-90 mt-2"
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
        )}
      </div>
    </div>
  );
};

export default GalacticCollector;