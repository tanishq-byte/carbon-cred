import { useEffect, useState } from "react";
import API from "../lib/axios";
import { decodeToken } from "../utils/decodeToken";
import { formatAddress } from "../utils/formatAddress";

interface Emission {
  fuel: number;
  electricity: number;
  waste: number;
  totalCO2e: number;
  submittedAt: string;
}

interface Token {
  amount: number;
  transactionType: "mint" | "burn" | "transfer";
  timestamp: string;
}

const MyEmission = () => {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    // get token from local storage
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    setRole(decoded.role);

    API.get("/emissions/my")
      .then((res) => setEmissions(res.data))
      .catch((err) => console.error("Emission fetch error", err));

    API.get("/tokens/my")
      .then((res) => setTokens(res.data))
      .catch((err) => console.error("Token fetch error", err));
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const addr = window.ethereum.selectedAddress;
      if (addr) setWallet(addr);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
    {/* Animated background elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>
    
    <div className="relative max-w-4xl px-4 mx-auto pt-10 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
           My Emission
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full"></div>
      </div>
  
      {/* User Info Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <p className="text-purple-300 text-sm font-medium">OPERATOR</p>
              <p className="text-white text-lg font-bold">{role}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <p className="text-purple-300 text-sm">QUANTUM WALLET</p>
            <p className="text-white font-mono text-lg">
              {wallet ? formatAddress(wallet) : "◊ DISCONNECTED"}
            </p>
          </div>
        </div>
      </div>
  
      {/* Emission History */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              CARBON MATRIX
            </h3>
          </div>
          
          {emissions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◇</span>
              </div>
              <p className="text-purple-300">No data streams detected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emissions.map((emission, idx) => (
                <div key={idx} className="group/item hover:scale-[1.02] transition-all duration-300">
                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-400/30 rounded-xl backdrop-blur-sm">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-purple-300 uppercase tracking-wide">FUEL</p>
                        <p className="text-white font-bold">{emission.fuel} L</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-purple-300 uppercase tracking-wide">ENERGY</p>
                        <p className="text-white font-bold">{emission.electricity} kWh</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-purple-300 uppercase tracking-wide">WASTE</p>
                        <p className="text-white font-bold">{emission.waste} kg</p>
                      </div>
                    </div>
                    <div className="border-t border-purple-400/20 pt-3">
                      <p className="text-center">
                        <span className="text-purple-300 text-sm">TOTAL CO₂e: </span>
                        <span className="text-red-400 font-bold text-lg">{emission.totalCO2e.toFixed(2)} kg</span>
                      </p>
                      <p className="text-xs text-purple-400 text-center mt-2 font-mono">
                        {new Date(emission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Token Activity */}
      <div className="relative group mb-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              QUANTUM LEDGER
            </h3>
          </div>
          
          {tokens.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◈</span>
              </div>
              <p className="text-purple-300">No transactions in the void.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token, idx) => (
                <div key={idx} className="group/item hover:scale-[1.02] transition-all duration-300">
                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-purple-300 text-sm uppercase tracking-wide">Transaction Type</p>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        token.amount > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {token.amount > 0 ? '+' : ''}{token.amount}
                      </div>
                    </div>
                    <p className="text-white font-semibold mb-3">{token.transactionType}</p>
                    <p className="text-xs text-purple-400 font-mono">
                      {new Date(token.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default MyEmission;
