import React, { useState, useEffect } from 'react';
import { Wallet, Coins, Send, Flame, AlertCircle, CheckCircle } from 'lucide-react';

const TokenManager = () => {
  // State management
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);
  
  // Form states
  const [mintAmount, setMintAmount] = useState('');
  const [mintRecipient, setMintRecipient] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  
  // Loading states
  const [mintLoading, setMintLoading] = useState(false);
  const [burnLoading, setBurnLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  // Example contract address and ABI (replace with your actual contract)
  const CONTRACT_ADDRESS = '0x8B34711A4CE9365F9b0DBF23f6083f3A02B8E3ed'; // Replace with your token contract
  const ADMIN_ADDRESS = '0xE3BDe23659B97D4Ef24ca90048B495407BC3E5dF'; // Replace with admin address
  
  // Minimal ERC-20 ABI with mint and burn functions
  const TOKEN_ABI = [
    {
      "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
      "name": "transfer",
      "outputs": [{"name": "", "type": "bool"}],
      "type": "function"
    },
    {
      "inputs": [{"name": "_value", "type": "uint256"}],
      "name": "burn",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [{"name": "_to", "type": "address"}, {"name": "_amount", "type": "uint256"}],
      "name": "mint",
      "outputs": [],
      "type": "function"
    },
    {
      "inputs": [{"name": "_owner", "type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance", "type": "uint256"}],
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [{"name": "", "type": "uint8"}],
      "type": "function"
    }
  ];

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      addTransaction('error', 'MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
        await getTokenBalance(accounts[0]);
        addTransaction('success', 'Wallet connected successfully!');
      }
    } catch (error) {
      addTransaction('error', `Failed to connect wallet: ${error.message}`);
    }
  };

  // Get token balance
  const getTokenBalance = async (address) => {
    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: CONTRACT_ADDRESS,
          data: encodeFunction('balanceOf', [address])
        }, 'latest']
      });
      
      const balance = parseInt(balanceHex, 16);
      setTokenBalance((balance / Math.pow(10, 18)).toString()); // Assuming 18 decimals
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  // Encode function call
  const encodeFunction = (functionName, params) => {
    const functionSignatures = {
      'balanceOf': '70a08231',
      'transfer': 'a9059cbb',
      'mint': '40c10f19',
      'burn': '42966c68'
    };

    let data = '0x' + functionSignatures[functionName];
    
    params.forEach(param => {
      if (typeof param === 'string' && param.startsWith('0x')) {
        // Address parameter
        data += param.slice(2).padStart(64, '0');
      } else {
        // Number parameter
        const hex = BigInt(param * Math.pow(10, 18)).toString(16);
        data += hex.padStart(64, '0');
      }
    });
    
    return data;
  };

  // Add transaction to history
  const addTransaction = (type, message, hash = null) => {
    const transaction = {
      id: Date.now(),
      type,
      message,
      hash,
      timestamp: new Date().toLocaleTimeString()
    };
    setTransactions(prev => [transaction, ...prev.slice(0, 9)]); // Keep last 10 transactions
  };

  // Mint tokens (admin only)
  const mintTokens = async () => {
    if (!isAdmin) {
      addTransaction('error', 'Only admin can mint tokens');
      return;
    }

    if (!mintAmount || !mintRecipient) {
      addTransaction('error', 'Please fill in all mint fields');
      return;
    }

    setMintLoading(true);
    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: CONTRACT_ADDRESS,
          data: encodeFunction('mint', [mintRecipient, parseFloat(mintAmount)])
        }]
      });

      addTransaction('success', `Mint transaction sent! ${parseFloat(mintAmount)} tokens to ${mintRecipient}`, txHash);
      setMintAmount('');
      setMintRecipient('');
      
      // Refresh balance after a delay
      setTimeout(() => getTokenBalance(walletAddress), 3000);
    } catch (error) {
      addTransaction('error', `Mint failed: ${error.message}`);
    } finally {
      setMintLoading(false);
    }
  };

  // Burn tokens
  const burnTokens = async () => {
    if (!burnAmount) {
      addTransaction('error', 'Please enter amount to burn');
      return;
    }

    if (parseFloat(burnAmount) > parseFloat(tokenBalance)) {
      addTransaction('error', 'Insufficient balance to burn');
      return;
    }

    setBurnLoading(true);
    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: CONTRACT_ADDRESS,
          data: encodeFunction('burn', [parseFloat(burnAmount)])
        }]
      });

      addTransaction('success', `Burn transaction sent! ${parseFloat(burnAmount)} tokens burned`, txHash);
      setBurnAmount('');
      
      // Refresh balance after a delay
      setTimeout(() => getTokenBalance(walletAddress), 3000);
    } catch (error) {
      addTransaction('error', `Burn failed: ${error.message}`);
    } finally {
      setBurnLoading(false);
    }
  };

  // Transfer tokens
  const transferTokens = async () => {
    if (!transferAmount || !transferRecipient) {
      addTransaction('error', 'Please fill in all transfer fields');
      return;
    }

    if (parseFloat(transferAmount) > parseFloat(tokenBalance)) {
      addTransaction('error', 'Insufficient balance for transfer');
      return;
    }

    setTransferLoading(true);
    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: CONTRACT_ADDRESS,
          data: encodeFunction('transfer', [transferRecipient, parseFloat(transferAmount)])
        }]
      });

      addTransaction('success', `Transfer transaction sent! ${parseFloat(transferAmount)} tokens to ${transferRecipient}`, txHash);
      setTransferAmount('');
      setTransferRecipient('');
      
      // Refresh balance after a delay
      setTimeout(() => getTokenBalance(walletAddress), 3000);
    } catch (error) {
      addTransaction('error', `Transfer failed: ${error.message}`);
    } finally {
      setTransferLoading(false);
    }
  };

  // Check if wallet is already connected on page load
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
            getTokenBalance(accounts[0]);
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
          getTokenBalance(accounts[0]);
        } else {
          setWalletAddress('');
          setIsConnected(false);
          setIsAdmin(false);
          setTokenBalance('0');
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Coins className="text-yellow-400" size={40} />
            Token Manager
          </h1>
          <p className="text-gray-300">Mint, burn, and transfer tokens with ease</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="text-blue-400" size={24} />
              <div>
                <h2 className="text-white font-semibold">Wallet Status</h2>
                <p className="text-gray-300 text-sm">
                  {isConnected ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                </p>
              </div>
            </div>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="text-right">
                <p className="text-white font-medium">{tokenBalance} Tokens</p>
                {isAdmin && <span className="text-yellow-400 text-sm">Admin Access</span>}
              </div>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Token Operations */}
            <div className="space-y-6">
              {/* Mint Section */}
              <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${!isAdmin ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Coins className="text-green-400" size={24} />
                  <h3 className="text-white font-semibold text-lg">Mint Tokens</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    isAdmin 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {isAdmin ? 'Admin Access' : 'Admin Only'}
                  </span>
                </div>
                {!isAdmin && (
                  <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Only admin wallet ({ADMIN_ADDRESS.slice(0, 6)}...{ADMIN_ADDRESS.slice(-4)}) can mint tokens
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={mintRecipient}
                    onChange={(e) => setMintRecipient(e.target.value)}
                    disabled={!isAdmin}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="number"
                    placeholder="Amount to mint"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    disabled={!isAdmin}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={mintTokens}
                    disabled={mintLoading || !isAdmin}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {mintLoading ? 'Minting...' : 'Mint Tokens'}
                    <Coins size={20} />
                  </button>
                </div>
              </div>

              {/* Burn Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="text-red-400" size={24} />
                  <h3 className="text-white font-semibold text-lg">Burn Tokens</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="number"
                    placeholder="Amount to burn"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={burnTokens}
                    disabled={burnLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {burnLoading ? 'Burning...' : 'Burn Tokens'}
                    <Flame size={20} />
                  </button>
                </div>
              </div>

              {/* Transfer Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Send className="text-blue-400" size={24} />
                  <h3 className="text-white font-semibold text-lg">Transfer Tokens</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount to transfer"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={transferTokens}
                    disabled={transferLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {transferLoading ? 'Transferring...' : 'Transfer Tokens'}
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">Transaction History</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No transactions yet</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className={`p-3 rounded-lg border-l-4 ${
                      tx.type === 'success' 
                        ? 'bg-green-500/10 border-green-500' 
                        : 'bg-red-500/10 border-red-500'
                    }`}>
                      <div className="flex items-start gap-2">
                        {tx.type === 'success' ? (
                          <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                        ) : (
                          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{tx.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-400 text-xs">{tx.timestamp}</span>
                            {tx.hash && (
                              <a
                                href={`https://etherscan.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs underline"
                              >
                                View TX
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
              <Wallet className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-white text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-300 mb-4">
                Connect your MetaMask wallet to start managing tokens
              </p>
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Connect MetaMask
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenManager;