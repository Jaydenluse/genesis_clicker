import React, { useEffect, useState } from 'react';
import { LuAtom, LuDna, LuDroplet, LuScissors, LuZap, LuPackage, LuInfo, LuCircleDotDashed, LuCircleDot} from 'react-icons/lu';
import { TbCircles } from "react-icons/tb";
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { useGameContext } from '../components/Layout';

const UpgradeSection = ({ title, upgrades, tierLevel, unlockCondition, tooltipText }) => {
  const { localStardust, buyUpgrade, upgradeCounts } = useGameContext();

  const isUnlocked = unlockCondition(upgradeCounts);

  return (
    <div className={`bg-gray-700 p-4 rounded-lg mb-4 relative ${isUnlocked ? '' : 'opacity-50 pointer-events-none'}`}>
      <h2 className="font-mp text-3xl mb-4 text-center">{title}</h2>
      
      <div className="absolute top-2 right-2 group">
        <LuInfo size={18} className="text-blue-400 cursor-help" />
        <div className="absolute hidden group-hover:block -bottom-8 right-6 mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
          {tooltipText}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {upgrades.map(upgrade => {
          const count = upgradeCounts[upgrade.name] || 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
          const isUpgradeUnlocked = upgrade.unlockCondition ? upgrade.unlockCondition(upgradeCounts) : true;

          return (
            <div key={upgrade.name} className={`bg-gray-800 p-4 rounded-lg flex flex-col items-center relative ${isUpgradeUnlocked ? '' : 'opacity-50'}`}>
              <div className="absolute top-2 right-2 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold">{count}</span>
              </div>
              <upgrade.icon size={32} className="mb-2" />
              <span className="text-xl font-bold font-mp">{upgrade.name}</span>
              <span className="text-base font-mp">Cost: {cost} Stardust</span>
              <span className="text-base font-mp">+{upgrade.sps} SPS</span>
              <button
                onClick={() => buyUpgrade(upgrade)}
                disabled={localStardust < cost || !isUpgradeUnlocked}
                className="mt-2 font-mp bg-purple-600 hover:bg-purple-800 text-white font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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

const UpgradeTree = () => {
  const { stardust, setStardust, sps, setSps, upgradeCounts, setUpgradeCounts } = useGameContext();
  const [localStardust, setLocalStardust] = useState(stardust);

  const upgradeTiers = [
    {
      title: "Basic Building Blocks",
      upgrades: [
        { name: 'Amino Acids', icon: LuAtom, baseCost: 15, sps: 1 },
        { name: 'Nucleotides', icon: LuDna, baseCost: 100, sps: 5 },
        { name: 'Lipids', icon: LuDroplet, baseCost: 1100, sps: 25 },
      ],
      unlockCondition: () => true,
      tooltipText: "Fundamental components of life"
    },
    {
      title: "Advanced Structures",
      upgrades: [
        { name: 'RNA', icon: LuScissors, baseCost: 25000, sps: 1000 },
        { name: 'Enzymes', icon: LuZap, baseCost: 50000, sps: 2000 },
        { name: 'Vesicles', icon: LuPackage, baseCost: 200000, sps: 8000 },
      ],
      unlockCondition: (counts) => ['Amino Acids', 'Nucleotides', 'Lipids'].every(u => (counts[u] || 0) >= 10),
      tooltipText: "Requires 10 of each Basic Building Block"
    },
    {
      title: "Complex Life Systems",
      upgrades: [
        { name: 'Prokaryotic Cells', icon: LuCircleDot, baseCost: 500000, sps: 15000 },
        { name: 'Eukaryotic Cells', icon: LuCircleDotDashed, baseCost: 1000000, sps: 30000 },
        { name: 'Multicellular Organisms', icon: TbCircles, baseCost: 5000000, sps: 60000 },
      ],
      unlockCondition: (counts) => ['RNA', 'Enzymes', 'Vesicles'].every(u => (counts[u] || 0) >= 10),
      tooltipText: "Requires 10 of each Advanced Structure"
    }
  ];

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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto px-5 py-3">
        {upgradeTiers.map((tier, index) => (
          <React.Fragment key={tier.title}>
            <UpgradeSection
              title={tier.title}
              upgrades={tier.upgrades}
              tierLevel={index}
              unlockCondition={tier.unlockCondition}
              tooltipText={tier.tooltipText}
            />
            {index < upgradeTiers.length - 1 && (
              <div className='flex justify-center my-2'>
                {tier.unlockCondition(upgradeCounts) ? <MdLockOpen size={32} /> : <MdLockOutline size={32} />}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UpgradeTree;