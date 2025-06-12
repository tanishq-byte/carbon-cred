import React, { useState, useEffect } from 'react';
import { Wallet, Coins, Send, Flame, AlertCircle, CheckCircle } from 'lucide-react';


const TokenManager = () => {
  // previous data
  const [prevtransactions, setPrevtransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('http://localhost:8000/api/mint/all');
        const response = await fetch('http://localhost:8000/api/transactions');

        const data = await response.json();
        setPrevtransactions(data);
      } catch (error) {
        console.error('Error fetching mint transactions:', error);
      }
    };

    fetchData();
  }, []);


  // with reciept
  const [recprevtransactions, setrecPrevtransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('http://localhost:8000/api/mint/all');
        const response = await fetch('http://localhost:8000/api/mint/all');

        const data = await response.json();
        setrecPrevtransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
  }, []);
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
  const CONTRACT_ADDRESS = '0x97fE0694fB820d00c9eB4b31fA0313d35111EEc2'; // Replace with your token contract
  const ADMIN_ADDRESS = '0x7EAeBf6b4758F3d10797C1eDa7999A1aec292b4A'; // Replace with admin address
  
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
// -----------------------------------------
  // // Add transaction to history
  // const addTransaction = (type, message, hash = null) => {
  //   const transaction = {
  //     id: Date.now(),
  //     type,
  //     message,
  //     hash,
  //     timestamp: new Date().toLocaleTimeString()
  //   };
  //   setTransactions(prev => [transaction, ...prev.slice(0, 9)]); // Keep last 10 transactions
  // };
// -----------------------------------------

   // Add transaction to history
   const addTransaction = async (type, message, hash = null) => {
    const transaction = {
      id: Date.now(),
      type,
      message,
      hash,
      timestamp: new Date().toLocaleTimeString(),
    };
  
    // Save to state (frontend)
    setTransactions(prev => [transaction, ...prev.slice(0, 9)]);
  
    // Save to backend
    try {
      // const response = await fetch('http://localhost:8000/api/transactions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(transaction),
      // });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const savedTx = await response.json();
      console.log('Transaction saved to backend:', savedTx);
    } catch (err) {
      console.error('Failed to save transaction:', err.message);
    }
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
  
    if (parseFloat(mintAmount) <= 0) {
      addTransaction('error', 'Mint amount must be greater than zero');
      return;
    }
  
    setMintLoading(true);
  
    try {
      // Send mint transaction to smart contract
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: CONTRACT_ADDRESS,
          data: encodeFunction('mint', [mintRecipient, parseFloat(mintAmount)])
        }]
      });
  
      // Create transaction data with pvtkey field
      const transactionData = {
        pvtkey: mintRecipient, // Store recipient address as pvtkey
        type: 'success',
        message: `✅ Minted ${parseFloat(mintAmount)} tokens to ${mintRecipient.slice(0, 6)}...${mintRecipient.slice(-4)}`,
        hash: txHash,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
  
      // Save transaction to both endpoints
      await Promise.all([
        // Save to main transactions endpoint with pvtkey
        fetch('http://localhost:8000/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData)
        }),
        
        // Also save to mint-specific endpoint if needed
        fetch('http://localhost:8000/api/mint/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            mintAmount, 
            mintRecipient,
            txHash
          })
        })
      ]);
  
      addTransaction(
        'success',
        `✅ Minted ${parseFloat(mintAmount)} tokens to ${mintRecipient.slice(0, 6)}...${mintRecipient.slice(-4)}`,
        txHash
      );
  
      setMintAmount('');
      setMintRecipient('');
      setTimeout(() => getTokenBalance(walletAddress), 3000);
    } catch (error) {
      addTransaction('error', `Mint failed: ${error.message}`);
    } finally {
      setMintLoading(false);
    }
  };
  // const mintTokens = async () => {
  //   if (!isAdmin) {
  //     addTransaction('error', 'Only admin can mint tokens');
  //     return;
  //   }
  
  //   if (!mintAmount || !mintRecipient) {
  //     addTransaction('error', 'Please fill in all mint fields');
  //     return;
  //   }
  
  //   if (parseFloat(mintAmount) <= 0) {
  //     addTransaction('error', 'Mint amount must be greater than zero');
  //     return;
  //   }
  
  //   setMintLoading(true);
  
  //   try {
  //     // Send mint transaction to smart contract
  //     const txHash = await window.ethereum.request({
  //       method: 'eth_sendTransaction',
  //       params: [{
  //         from: walletAddress,
  //         to: CONTRACT_ADDRESS,
  //         data: encodeFunction('mint', [mintRecipient, parseFloat(mintAmount)])
  //       }]
  //     });
  
  //     // Log mint action to backend
  //     await fetch('http://localhost:8000/api/mint/submit', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ mintAmount, mintRecipient })
  //     });
  
  //     addTransaction(
  //       'success',
  //       `✅ Minted ${parseFloat(mintAmount)} tokens to ${mintRecipient.slice(0, 6)}...${mintRecipient.slice(-4)}`,
  //       txHash
  //     );
  
  //     setMintAmount('');
  //     setMintRecipient('');
  //     setTimeout(() => getTokenBalance(walletAddress), 3000);
  //   } catch (error) {
  //     addTransaction('error', `Mint failed: ${error.message}`);
  //   } finally {
  //     setMintLoading(false);
  //   }
  // };
  
  // const mintTokens = async () => {
  //   if (!isAdmin) {
  //     addTransaction('error', 'Only admin can mint tokens');
  //     return;
  //   }

  //   if (!mintAmount || !mintRecipient) {
  //     addTransaction('error', 'Please fill in all mint fields');
  //     return;
  //   }

  //   setMintLoading(true);
  //   try {
  //     const txHash = await window.ethereum.request({
  //       method: 'eth_sendTransaction',
  //       params: [{
  //         from: walletAddress,
  //         to: CONTRACT_ADDRESS,
  //         data: encodeFunction('mint', [mintRecipient, parseFloat(mintAmount)])
  //       }]
  //     });

  //     addTransaction('success', `Mint transaction sent! ${parseFloat(mintAmount)} tokens to ${mintRecipient}`, txHash);
  //     setMintAmount('');
  //     setMintRecipient('');
      
  //     // Refresh balance after a delay
  //     setTimeout(() => getTokenBalance(walletAddress), 3000);
  //   } catch (error) {
  //     addTransaction('error', `Mint failed: ${error.message}`);
  //   } finally {
  //     setMintLoading(false);
  //   }
  // };

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
              {/* <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${!isAdmin ? 'opacity-60' : ''}`}>
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
              </div> */}
<div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 ${!isAdmin ? 'opacity-60' : ''}`}>
  <div className="flex items-center gap-3 mb-4">
    <Coins className="text-green-400" size={24} />
    <h3 className="text-white font-semibold text-lg">Mint Tokens</h3>
    <span className={`px-2 py-1 rounded text-xs ${isAdmin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
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
                                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
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


            
             <div className="p-4">
             <h2 className="text-lg font-bold mb-2">Previous Mint Transactions</h2>
              

             {prevtransactions.map((tx) => (
  <div key={tx._id} className={`p-3 rounded-lg border-l-4 ${
    tx.type === 'success' 
      ? 'bg-green-500/10 border-green-500' 
      : 'bg-red-500/10 border-red-500'
  } mb-3`}>
    <div className="flex items-start gap-2">
      {tx.type === 'success' ? (
        <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
      ) : (
        <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{tx.message}</p>
        {tx.pvtkey && (
          <p className="text-xs text-gray-400 mt-1">
            Recipient: {tx.pvtkey.slice(0, 6)}...{tx.pvtkey.slice(-4)}
          </p>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-400 text-xs">
            {new Date(tx.createdAt).toLocaleString()}
          </span>
          {tx.hash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
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
))}




{/* reciept */}
          <h2 className="text-lg font-bold mb-2">Previous Mint Transactions Reciept</h2>
          <div className="p-4">
                {recprevtransactions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No transactions yet</p>
                ) : (
                  recprevtransactions.map((tx) => (
                    <div
                      key={tx._id}
                      className={`p-3 rounded-lg border-l-4 bg-green-500/10 border-green-500 mb-3`}
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">
                            Minted <strong>{tx.mintAmount}</strong> tokens to{' '}
                            <span className="text-blue-300">{tx.mintRecipient}</span>
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-400 text-xs">
                              {new Date(tx.createdAt).toLocaleString()}
                            </span>
                            {/* Optional: Add View TX link if hash is present */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

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