import React, { useEffect, useState } from 'react';
import { LuInfo } from 'react-icons/lu';
import { MdLockOpen, MdLockOutline } from "react-icons/md";
import { useGameContext } from '../components/Layout';
import { aminoAcid, nucleotide, lipid, rna, enzymes, vesicles, prokaryotic, eukaryotic, multicellular, fungi, plants, animals, human } from '../public/images';

const UpgradeSection = ({ title, upgrades, unlockCondition, tooltipText, isUnique }) => {
  const { stardust, buyUpgrade, upgradeCounts } = useGameContext();

  const isUnlocked = unlockCondition(upgradeCounts);


  return (
    <div className={`bg-gray-700 p-4 rounded-lg mb-4 relative 
      ${isUnlocked ? '' : 'opacity-50 pointer-events-none'}
      ${isUnique ? 'border-2 border-yellow-600 shadow-lg shadow-yellow-600/50' : ''}
    `}>
      <h2 className={`font-mp text-3xl mb-4 text-center ${isUnique ? 'text-yellow-600' : 'text-white'}`}>
        {title}
      </h2>
      
      <div className="absolute top-2 right-2 group">
        <LuInfo size={18} className="text-blue-400 cursor-help" />
        <div className="absolute hidden font-mp group-hover:block -bottom-8 right-6 mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
          {tooltipText}
        </div>
      </div>

      <div className={`grid ${isUnique ? 'grid-cols-1 justify-items-center' : 'grid-cols-3'} gap-4`}>
        {upgrades.map(upgrade => {
          const count = upgradeCounts[upgrade.name] || 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, count));
          const isUpgradeUnlocked = upgrade.unlockCondition ? upgrade.unlockCondition(upgradeCounts) : true;
          const canBuy = stardust >= cost && isUpgradeUnlocked;

          return (
            <div 
              key={upgrade.name} 
              onClick={() => canBuy && buyUpgrade(upgrade)}
              className={`bg-gray-900 p-4 rounded-lg flex flex-col items-center relative
                ${canBuy ? 'cursor-pointer hover:bg-gray-800 active:bg-gray-600 transform active:scale-95 transition-all duration-100' : 'opacity-50 cursor-not-allowed'}
                ${isUnique ? 'border-2 border-yellow-600 w-3/4 shadow-md shadow-yellow-600/50' : 'w-full'}
              `}
            >
              <div className="absolute top-2 right-2 bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold">{count}</span>
              </div>
              <div className={`${isUnique ? 'w-32 h-32' : 'w-16 h-16'} mb-2 flex items-center justify-center`}>
                <img src={upgrade.image} alt={upgrade.name} className="w-full h-full object-contain" />
              </div>
              <span className={`text-xl font-bold font-mp ${isUnique ? 'text-yellow-400' : 'text-white'}`}>{upgrade.name}</span>
              <span className="text-base font-mp">Cost: {cost} Stardust</span>
              <span className="text-base font-mp">+{upgrade.sps} SPS</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UpgradeTree = () => {
  const { stardust, upgradeCounts } = useGameContext();



  const upgradeTiers = [
    {
      title: "Basic Building Blocks",
      upgrades: [
        { name: 'Amino Acids', baseCost: 15, sps: 1, image: aminoAcid },
        { name: 'Nucleotides', baseCost: 100, sps: 5, image: nucleotide },
        { name: 'Lipids', baseCost: 1100, sps: 25, image: lipid },
      ],
      unlockCondition: () => true,
      tooltipText: "Next tier requires 10 of each Basic Building Block"
    },
    {
      title: "Advanced Structures",
      upgrades: [
        { name: 'RNA', baseCost: 25000, sps: 1000, image: rna },
        { name: 'Enzymes', baseCost: 50000, sps: 2000, image: enzymes },
        { name: 'Vesicles', baseCost: 200000, sps: 8000, image: vesicles },
      ],
      unlockCondition: (counts) => ['Amino Acids', 'Nucleotides', 'Lipids'].every(u => (counts[u] || 0) >= 10),
      tooltipText: "Next tier requires 10 of each Advanced Structure"
    },
    {
      title: "Complex Life Systems",
      upgrades: [
        { name: 'Prokaryotic Cells', baseCost: 500000, sps: 15000, image: prokaryotic },
        { name: 'Eukaryotic Cells', baseCost: 1000000, sps: 30000, image: eukaryotic },
        { name: 'Multicellular Organisms', baseCost: 5000000, sps: 60000, image: multicellular },
      ],
      unlockCondition: (counts) => ['RNA', 'Enzymes', 'Vesicles'].every(u => (counts[u] || 0) >= 10),
      tooltipText: "Requires 10 of each Complex Life Systems"
    }, 
    {
      title: "Diverse Life Forms",
      upgrades: [
        { name: 'Fungi', baseCost: 10000000, sps: 100000, image: fungi },
        { name: 'Plants', baseCost: 50000000, sps: 500000, image: plants},
        { name: 'Animals', baseCost: 100000000, sps: 1000000, image: animals},
      ],
      unlockCondition: (counts) => ['Prokaryotic Cells', 'Eukaryotic Cells', 'Multicellular Organisms'].every(u => (counts[u] || 0) >= 10),
      tooltipText: "Next tier requires 10 of each Diverse Life Form"
    },
    {
      title: "Sentient Life",
      upgrades: [
        { name: 'Human', baseCost: 1000000000, sps: 10000000, image: human }
      ],
      unlockCondition: (counts) => ['Fungi', 'Plants', 'Animals'].every(u => (counts[u] || 0) >= 10),
      tooltipText: "The pinnacle of evolution",
      isUnique: true 
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto px-5 py-3">
        {upgradeTiers.map((tier, index) => (
          <React.Fragment key={tier.title}>
            <UpgradeSection
              title={tier.title}
              upgrades={tier.upgrades}
              isUnique={tier.isUnique}
              unlockCondition={tier.unlockCondition}
              tooltipText={tier.tooltipText}
            />
            {index < upgradeTiers.length - 1 && (
              <div className='flex justify-center my-2'>
                {upgradeTiers[index + 1].unlockCondition(upgradeCounts) 
                  ? <MdLockOpen size={32} /> 
                  : <MdLockOutline size={32} />
                }
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UpgradeTree;