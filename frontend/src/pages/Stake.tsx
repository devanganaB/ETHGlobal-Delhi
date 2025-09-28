import React, { useState, useEffect } from 'react';
import { Code, Trophy, Zap, Target, ArrowRight, Sparkles, Coins, TrendingUp, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLocation , useNavigate} from 'react-router-dom';
import { ethers } from "ethers";
import NativeContestPool from '../contracts/NativeContestPool.json';
import { useAccount } from "wagmi";

const Stake = () => {

  const location = useLocation();
  const receivedData = location.state;

    const [contract, setContract] = useState(null);
    const navigate = useNavigate();
  

  useEffect(() => {
    if(receivedData == "contest"){
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create a new contract instance with the signer
        const contractInstance = new ethers.Contract(
          "0x876246e2bF7A8AF68F39Fc4F30f2984aA21cF800",
          NativeContestPool,
          signer
        );
      setContract(contractInstance);
     } 
    } 
  },[receivedData])

  const stake = async() => {
    try {
      const response = await contract.enterHabitPool({value : 1})
      navigate('/contest')  
    } catch (error) {
      console.log(error)
    }
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
          
          {/* Stats Section */}
          
          <button onClick={stake}>
            STAKE
          </button>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-violet-500/20 to-transparent blur-3xl" />
    </div>
  )
}

export default Stake