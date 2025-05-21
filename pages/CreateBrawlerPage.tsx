

import React, { useState }from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { createNewBrawler } from '../services/brawlerService';
import { BrawlerClass, ClassDescription } from '../types';
import { BRAWLER_CLASSES } from '../constants';
import { ActionButton, LoadingSpinner, SectionTitle } from '../components/uiElements';
import { ShieldCheckIcon, SparklesIcon, PuzzlePieceIcon, UserCircleIcon, ArrowPathIcon } from '../components/Icons'; // Import more icons

const CreateBrawlerPage: React.FC = () => {
  const navigate = useNavigate();
  const { setBrawler, setLoading, isLoading, addNarrativeLog } = useGameContext();
  const [brawlerName, setBrawlerName] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<BrawlerClass>(BrawlerClass.CRIMSON_BRUTE);
  const [error, setError] = useState<string>('');

  const getClassIcon = (brawlerClass: BrawlerClass) => {
    const classInfo = BRAWLER_CLASSES.find(c => c.name === brawlerClass);
    // Since ClassDescription.icon is now non-optional, classInfo.icon will only be undefined if classInfo is undefined.
    return classInfo?.icon || <UserCircleIcon className="w-8 h-8" />;
  };

  const handleCreateBrawler = async () => {
    if (!brawlerName.trim()) {
      setError('Brawler name cannot be empty.');
      return;
    }
    if (brawlerName.trim().length < 3 || brawlerName.trim().length > 20) {
        setError('Brawler name must be between 3 and 20 characters.');
        return;
    }
    setError('');
    setLoading(true);
    try {
      const newBrawler = await createNewBrawler(brawlerName, selectedClass);
      setBrawler(newBrawler);
      addNarrativeLog({ type: 'system', text: `Brawler ${newBrawler.name} the ${newBrawler.brawlerClass} created!` });
      addNarrativeLog({ type: 'narrative', text: newBrawler.lore });
      navigate('/game');
    } catch (err) {
      console.error("Error creating brawler:", err);
      setError('Failed to create brawler. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <SectionTitle>CREATE NEW <span className="text-kaspa-teal">BRAWLER</span></SectionTitle>
      
      <div className="max-w-3xl mx-auto card-bg p-8 md:p-12 rounded-xl shadow-purple-glow">
        <div className="mb-8">
          <label htmlFor="brawlerName" className="block text-lg font-semibold text-kaspa-light-gray mb-2">
            BRAWLER NAME
          </label>
          <input
            type="text"
            id="brawlerName"
            value={brawlerName}
            onChange={(e) => setBrawlerName(e.target.value)}
            placeholder="Enter name..."
            className="w-full bg-kaspa-deep-blue/50 border border-kaspa-purple/50 rounded-lg px-4 py-3 text-kaspa-light-gray focus:ring-2 focus:ring-kaspa-teal focus:border-kaspa-teal outline-none transition-all"
          />
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-semibold text-kaspa-light-gray mb-4">SELECT CLASS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BRAWLER_CLASSES.map((classInfo: ClassDescription) => (
              <button
                key={classInfo.name}
                onClick={() => setSelectedClass(classInfo.name)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 transform hover:scale-105
                  ${selectedClass === classInfo.name ? `border-kaspa-teal shadow-teal-glow bg-kaspa-teal/10` : `border-kaspa-purple/50 hover:border-kaspa-purple card-bg`}
                `}
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto bg-gradient-to-br ${classInfo.colorGradient}`}>
                  {/* FIX: Removed 'as React.ReactElement' cast. 
                      With ClassDescription.icon now being React.ReactElement<React.SVGProps<SVGSVGElement>>, 
                      TypeScript can correctly infer the element type and its props for React.cloneElement.
                  */}
                  {React.cloneElement(classInfo.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h4 className="text-xl font-orbitron text-kaspa-light-gray mb-1">{classInfo.name}</h4>
                <p className="text-xs text-kaspa-gray">{classInfo.description}</p>
                <div className="mt-3 text-left text-xs text-kaspa-gray space-y-1">
                    <p>STR: {classInfo.baseStats.strength.join('-')} | HP: {classInfo.baseStats.health.join('-')}</p>
                    <p>ARM: {classInfo.baseStats.armor.join('-')} | AGI: {classInfo.baseStats.agility.join('-')}</p>
                    <p>INT: {classInfo.baseStats.intelligence.join('-')} | MANA: {classInfo.baseStats.mana.join('-')}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {error && <p className="text-red-400 text-center mb-6">{error}</p>}

        <ActionButton
          onClick={handleCreateBrawler}
          disabled={isLoading}
          className="w-full text-xl py-4 flex items-center justify-center"
          variant="primary"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="w-6 h-6 mr-3" /> CREATING...
            </>
          ) : (
            <>
             <UserCircleIcon className="w-6 h-6 mr-2"/> CREATE BRAWLER
            </>
          )}
        </ActionButton>
      </div>
    </div>
  );
};

export default CreateBrawlerPage;