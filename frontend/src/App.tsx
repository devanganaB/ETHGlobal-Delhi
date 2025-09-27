import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Navbar from './components/Navbar';
import ConnectPage from './pages/ConnectPage';
import Habitpage from './pages/Habitpage';
import Contestpage from './pages/Contestpage';


const queryClient = new QueryClient();

const optimismTestnetSepolia = {
  id: 11155420,
  name: "OP Sepolia Testnet",
  network: "OP Sepolia Testnet",
  iconBackground: "#fff",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.optimism.io"] },
  },
};

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, optimismTestnetSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

function App() {
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<ConnectPage />} />
            <Route path="/habit" element={<Habitpage />} />
            <Route path="/contest" element={<Contestpage />} />
          </Routes>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
