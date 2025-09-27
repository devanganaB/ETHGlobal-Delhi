import React, { useState, useEffect } from 'react';
import { Code, Trophy, Zap, Target, ArrowRight, Sparkles, Coins, TrendingUp, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from "wagmi";
import { useNavigate } from 'react-router-dom';

const ConnectPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
  }, []);

const { address, isConnected } = useAccount();
  // const { data: walletClient } = useWalletClient();

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Build Daily Habit",
      description: "Solve a leetcode problem daily"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Daily Challenges",
      description: "Get crypto rewards for consistent practice"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Monitor your coding journey on-chain"
    }
  ];

  const goToHabitPage = async() => {
    if(!address || !isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    // contract query

    navigate('/habit');

  }

  return (
    <div className="min-h-screen w-full from-slate-900 via-purple-900 to-slate-500 bg-gradient-to-br relative overflow-hidden">
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 w-full">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Solv3
          </span>
        </div>
        
        <ConnectButton />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 w-full px-6 pt-20">
        <div className="text-center space-y-12">
          {/* Hero Section */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/90">Web3 × LeetCode Practice</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight">
              Code Daily,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Earn Crypto
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-white/80 max-w-5xl mx-auto leading-relaxed">
              Transform your coding journey with blockchain-powered incentives. 
              Build habits, solve problems, and get rewarded for your dedication.
            </p>
          </div>
          {/* Features Grid */}
          <div className={`pt-32 transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                  onClick={() => goToHabitPage()}
                >
                  <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className={`pt-32 pb-20 transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { value: '10K+', label: 'Problems Solved' },
                { value: '500+', label: 'Active Users' },
                { value: '$50K+', label: 'Rewards Distributed' },
                { value: '95%', label: 'Success Rate' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-lg mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-violet-500/20 to-transparent blur-3xl" />
    </div>
  );
};

export default ConnectPage;