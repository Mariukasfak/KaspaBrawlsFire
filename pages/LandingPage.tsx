
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButton, StatBar, SectionTitle } from '../components/uiElements';
import { UserCircleIcon, MenuIcon, PlusIcon, CommandLineIcon, TrophyIcon, GithubIcon, TwitterIcon, DiscordIcon } from '../components/Icons';
import { HOW_IT_WORKS_DATA, ROADMAP_DATA } from '../constants';
import { Brawler, HowItWorksItem, RoadmapStep } from '../types';
import { createDefaultBrawler } from '../services/brawlerService';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [defaultBrawler, setDefaultBrawler] = useState<Brawler | null>(null);

  useEffect(() => {
    const fetchBrawler = async () => {
        const brawler = await createDefaultBrawler();
        setDefaultBrawler(brawler);
    };
    fetchBrawler();
  }, []);

  const renderStatValue = (value: number | undefined) => (value !== undefined ? value : 0);


  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="text-center min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 animate-pulse">
            {/* Background large KASPABRAWLERS text or similar */}
        </div>
        <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-orbitron font-black text-kaspa-light-gray mb-2 animate-fade-in-down">
            KASPA
            </h1>
            <h1 className="text-6xl md:text-8xl font-orbitron font-black text-kaspa-teal mb-6 animate-fade-in-down animation-delay-300">
            BRAWLERS
            </h1>
            <p className="text-xl md:text-2xl text-kaspa-gray mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-500">
            Where Legends Are Born. Mint. Fight. Win.
            </p>
            <div className="space-x-0 md:space-x-6 space-y-4 md:space-y-0 flex flex-col md:flex-row justify-center items-center animate-fade-in-up animation-delay-700">
            <ActionButton onClick={() => navigate('/create')} variant="primary" className="w-full md:w-auto text-lg">
                START YOUR BRAWL
            </ActionButton>
            <ActionButton onClick={() => alert('Connect Wallet functionality coming soon!')} variant="outline" className="w-full md:w-auto text-lg">
                CONNECT WALLET
            </ActionButton>
            </div>
            <p className="mt-8 text-kaspa-gray text-sm animate-fade-in-up animation-delay-900">
                Mint unique NFT fighters. Battle for glory. Become a legend.
            </p>
        </div>
      </section>

      {/* Brawler Preview Section */}
      {defaultBrawler && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto card-bg p-8 rounded-xl shadow-purple-glow">
            <div className="flex flex-col items-center mb-8">
              <UserCircleIcon className="w-32 h-32 text-kaspa-purple mb-4" />
              <h3 className="text-3xl font-orbitron text-kaspa-teal">{defaultBrawler.name}</h3>
              <p className="text-sm text-kaspa-gray mt-2 px-4 text-center">{defaultBrawler.lore}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 px-4">
              <StatBar label="Attack" value={renderStatValue(defaultBrawler.stats.strength)} maxValue={100} colorClass="bg-gradient-to-r from-kaspa-pink to-red-500" />
              <StatBar label="Defense" value={renderStatValue(defaultBrawler.stats.armor)} maxValue={100} colorClass="bg-gradient-to-r from-kaspa-teal to-blue-500" />
              <StatBar label="Agility" value={renderStatValue(defaultBrawler.stats.agility)} maxValue={100} colorClass="bg-gradient-to-r from-green-400 to-lime-500" />
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section>
        <SectionTitle>HOW IT <span className="text-kaspa-teal">WORKS</span></SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_DATA.map((item: HowItWorksItem) => (
            <div key={item.id} className="card-bg p-8 rounded-lg text-center transform hover:scale-105 transition-transform duration-300 hover:shadow-purple-glow">
              <div className="flex justify-center mb-6 text-kaspa-purple">
                {item.icon}
              </div>
              <h3 className="text-2xl font-orbitron text-kaspa-light-gray mb-3">{item.title}</h3>
              <p className="text-kaspa-gray text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Brawlers Section */}
      <section>
        <SectionTitle>LATEST <span className="text-kaspa-teal">BRAWLERS</span></SectionTitle>
        <div className="card-bg p-8 rounded-lg text-center">
          <p className="text-kaspa-gray">No brawlers found</p>
          <ActionButton onClick={() => navigate('/create')} variant="secondary" className="mt-6">
            VIEW ALL BRAWLERS
          </ActionButton>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section>
        <SectionTitle>LEADER<span className="text-kaspa-teal">BOARD</span></SectionTitle>
        <div className="card-bg p-8 rounded-lg text-center">
          <p className="text-kaspa-gray">No leaderboard data found</p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section>
        <SectionTitle>ROAD<span className="text-kaspa-teal">MAP</span></SectionTitle>
        <div className="card-bg p-8 rounded-lg space-y-8">
          {ROADMAP_DATA.map((step: RoadmapStep) => (
            <div key={step.id} className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-kaspa-purple rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
                {step.id}
              </div>
              <div>
                <h4 className="text-xl font-orbitron text-kaspa-light-gray mb-1">{step.title}</h4>
                <p className="text-kaspa-gray text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Wall Section */}
      <section>
        <SectionTitle>COMMUNITY <span className="text-kaspa-teal">WALL</span></SectionTitle>
        <div className="card-bg p-8 rounded-lg">
          <h4 className="text-xl font-orbitron text-kaspa-light-gray mb-4">RECENT FIGHTS</h4>
          <p className="text-kaspa-gray text-center">No recent fights found</p>
           <div className="text-center mt-6">
                <ActionButton onClick={() => alert('View All Brawlers - Coming Soon!')} variant="secondary">
                    VIEW ALL BRAWLERS
                </ActionButton>
           </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-10 text-center">
            {[
                { name: 'Discord', icon: <DiscordIcon className="w-10 h-10 mx-auto mb-2" /> },
                { name: 'Twitter', icon: <TwitterIcon className="w-10 h-10 mx-auto mb-2" /> },
                { name: 'Github', icon: <GithubIcon className="w-10 h-10 mx-auto mb-2" /> },
            ].map(social => (
                 <a href="#" key={social.name} className="card-bg p-6 rounded-lg hover:bg-kaspa-purple/20 transition-colors hover:shadow-purple-glow">
                    {social.icon}
                    <p className="text-kaspa-light-gray font-semibold">{social.name}</p>
                </a>
            ))}
        </div>
        <div className="text-center mt-12">
            <ActionButton onClick={() => alert('Join The Community - Coming Soon!')} variant="primary" className="px-12 py-4 text-xl">
                JOIN THE COMMUNITY
            </ActionButton>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
