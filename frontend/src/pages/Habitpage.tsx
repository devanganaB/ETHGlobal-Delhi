import React from 'react'
import { Code, Trophy, Zap, Target, ArrowRight, Sparkles, Coins, TrendingUp, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';


const Habitpage = () => {
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
          
          {/* Stats Section */}
          
          <button>
            STAKE
          </button>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-violet-500/20 to-transparent blur-3xl" />
    </div>
  )
}

export default Habitpage