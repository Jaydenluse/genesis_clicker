import React, { useEffect, useState } from 'react';
import { LuAtom, LuDna, LuDroplet, LuScissors, LuZap, LuPackage, LuInfo } from 'react-icons/lu';
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { useGameContext } from '../components/Layout';

const UpgradeTree = () => {
  const { stardust, setStardust, sps, setSps, upgradeCounts, setUpgradeCounts } = useGameContext();
  const [localStardust, setLocalStardust] = useState(stardust);

  const basicUpgrades = [
    { name: 'Amino Acids', icon: LuAtom, baseCost: 15, sps: 1 },
    { name: 'Nucleotides', icon: LuDna, baseCost: 100, sps: 5 },
    { name: 'Lipids', icon: LuDroplet, baseCost: 1100, sps: 25 },
  ];

  const advancedUpgrades = [
    { name: 'RNA', icon: LuScissors, baseCost: 25000, sps: 1000, requires: ['Amino Acids', 'Nucleotides', 'Lipids'] },
    { name: 'Enzymes', icon: LuZap, baseCost: 50000, sps: 2000, requires: ['Amino Acids', 'Nucleotides', 'Lipids'] },
    { name: 'Vesicles', icon: LuPackage, baseCost: 200000, sps: 8000, requires: ['Amino Acids', 'Nucleotides', 'Lipids'] },
  ];

  const isAnyAdvancedUnlocked = advancedUpgrades.some(upgrade => 
    upgrade.requires.every(req => (upgradeCounts[req] || 0) >= 10)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalStardust(prevStardust => prevStardust + sps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [sps]);

  useEffect(() => {
    setStardust(Math.floor(localStardust));
  }, [localStardust, setStardust]);

  const buyUpgrade = (upgrade) => {
    const count = upgradeCounts[upgrade.name] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
    if (localStardust >= cost) {
      setLocalStardust(prev => prev - cost);
      setSps(prev => prev + upgrade.sps);
      setUpgradeCounts(prev => ({ ...prev, [upgrade.name]: (prev[upgrade.name] || 0) + 1 }));
    }
  };

  const renderUpgrade = (upgrade, isAdvanced = false) => {
    const count = upgradeCounts[upgrade.name] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
    const isUnlocked = isAdvanced ? upgrade.requires.every(req => (upgradeCounts[req] || 0) >= 10) : true;

    return (
      <div
        key={upgrade.name}
        className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center relative ${isUnlocked ? '' : 'opacity-50'}`}
      >
        <div className="absolute top-2 right-2 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-xs font-bold">{count}</span>
        </div>
        <upgrade.icon size={32} className="mb-2" />
        <span className="text-xl font-bold font-mp">{upgrade.name}</span>
        <span className="text-base font-mp">Cost: {cost} Stardust</span>
        <span className="text-base font-mp">+{upgrade.sps} SPS</span>
        <button
          onClick={() => buyUpgrade(upgrade)}
          disabled={localStardust < cost || !isUnlocked}
          className="mt-2 font-mp bg-purple-600 hover:bg-purple-800 text-white font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy
        </button>
      </div>
    );
  };

  return (
    <div className="h-full px-5 overflow-auto">

      {/* Building Block Upgrades */}
      <div className="bg-gray-700 p-4 rounded-lg mt-3 mb-6 relative">
        <h2 className="font-mp text-3xl mb-4 text-center">Basic Building Blocks</h2>

        {/* Tooltip */}
        <div className="absolute top-2 right-2 group">
          <LuInfo size={18} className="text-blue-400 cursor-help" />
          <div className="absolute hidden group-hover:block bottom-6 right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
            10x of Basic Building Blocks to unlock Advanced
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {basicUpgrades.map(upgrade => renderUpgrade(upgrade))}
        </div>
      </div>


      {/* Lock/Unlock */}
      <div className='flex flex-col items-center justify-center'>
        {isAnyAdvancedUnlocked ? (
          <MdLockOpen size={32} aria-label="Unlocked" />
        ) : (
          <MdLockOutline size={32} aria-label="Locked" />
        )}
      </div>

      {/* Advanced Upgrades */}
      <div className={`bg-gray-700 p-4 rounded-lg mt-6 mb-6 relative ${isAnyAdvancedUnlocked ? '' : 'opacity-50 pointer-events-none'}`}>
        <h2 className="font-mp text-3xl mb-4 text-center">Advanced Structures</h2>
        
        {/* Tooltip */}
        <div className="absolute top-2 right-2 group">
          <LuInfo size={18} className="text-blue-400 cursor-help" />
          <div className="absolute hidden group-hover:block bottom-6 right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
            sfsdgsg
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {advancedUpgrades.map(upgrade => renderUpgrade(upgrade, true))}
        </div>
      </div>
    </div>
  );
};


export default UpgradeTree;