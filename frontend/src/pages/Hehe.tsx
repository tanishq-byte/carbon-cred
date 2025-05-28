import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Enhanced Contract ABI (you'll need this new contract)
const ENHANCED_CONTRACT_ABI = [
  // Existing functions
  "function registerCompany(string memory name) external",
  "function reportEmissions(uint256 emissions) external",
  "function buyCredits(uint256 amount) external payable",
  "function companies(address) external view returns (bool, string, uint256, uint256)",
  "function carbonToken() external view returns (address)",
  "function tokenPrice() external view returns (uint256)",
  
  // New Marketplace functions
  "function createListing(uint256 amount, uint256 pricePerCredit) external",
  "function purchaseFromListing(uint256 listingId, uint256 amount) external payable",
  "function cancelListing(uint256 listingId) external",
  "function getAllListings() external view returns (tuple(uint256 id, address seller, uint256 amount, uint256 remaining, uint256 pricePerCredit, bool active)[])",
  "function transferCredits(address to, uint256 amount) external",
  "function getUserListings(address user) external view returns (uint256[])",
  
  // Events
  "event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerCredit)",
  "event ListingPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalCost)",
  "event CreditsPurchased(address indexed buyer, uint256 amount)",
  "event CreditsTransferred(address indexed from, address indexed to, uint256 amount)"
];

const CONTRACT_ADDRESS = "0x64c1fb612EB03ff6e46667E950C1541364779D89"; // Replace with your enhanced contract
const SEPOLIA_CHAIN_ID = '0xaa36a7';

interface Company {
  isRegistered: boolean;
  name: string;
  emissions: number;
  credits: number;
}

interface Listing {
  id: number;
  seller: string;
  amount: number;
  remaining: number;
  pricePerCredit: number;
  active: boolean;
}

interface Transaction {
  hash: string;
  type: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  details: string;
}

const CarbonMarketplace: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<any>(null);
  const [tokenContract, setTokenContract] = useState<any>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [listings, setListings] = useState<Listing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form states
  const [companyName, setCompanyName] = useState<string>('');
  const [emissions, setEmissions] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [listAmount, setListAmount] = useState<string>('');
  const [listPrice, setListPrice] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');

  const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ];

  const addTransaction = (hash: string, type: string, details: string) => {
    const newTx: Transaction = {
      hash,
      type,
      timestamp: new Date(),
      status: 'pending',
      details
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(parseInt(SEPOLIA_CHAIN_ID, 16))) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
          }
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ENHANCED_CONTRACT_ABI, signer);
      setContract(contractInstance);

      // Get token contract
      const tokenAddress = await contractInstance.carbonToken();
      const tokenInstance = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      setTokenContract(tokenInstance);

      // Load user data
      await loadUserData(contractInstance, tokenInstance, accounts[0]);
      await loadListings(contractInstance);

    } catch (error: any) {
      console.error('Connection error:', error);
      setError(error.message);
    }
  };

  const loadUserData = async (contractInstance: any, tokenInstance: any, userAddress: string) => {
    try {
      const companyData = await contractInstance.companies(userAddress);
      setCompany({
        isRegistered: companyData[0],
        name: companyData[1],
        emissions: Number(companyData[2]),
        credits: Number(companyData[3])
      });

      const balance = await tokenInstance.balanceOf(userAddress);
      setTokenBalance(ethers.formatEther(balance));

      const provider = new ethers.BrowserProvider(window.ethereum);
      const ethBal = await provider.getBalance(userAddress);
      setEthBalance(ethers.formatEther(ethBal));

    } catch (error: any) {
      console.error('Error loading user data:', error);
    }
  };

  const loadListings = async (contractInstance: any) => {
    try {
      const allListings = await contractInstance.getAllListings();
      const formattedListings = allListings.map((listing: any) => ({
        id: Number(listing.id),
        seller: listing.seller,
        amount: Number(listing.amount),
        remaining: Number(listing.remaining),
        pricePerCredit: Number(ethers.formatEther(listing.pricePerCredit)),
        active: listing.active
      })).filter((listing: Listing) => listing.active && listing.remaining > 0);
      
      setListings(formattedListings);
    } catch (error: any) {
      console.error('Error loading listings:', error);
    }
  };

  const registerCompany = async () => {
    if (!contract || !companyName.trim()) return;
    
    setLoading(true);
    try {
      const tx = await contract.registerCompany(companyName);
      addTransaction(tx.hash, 'Company Registration', `Registered company: ${companyName}`);
      await tx.wait();
      await loadUserData(contract, tokenContract, account);
      setCompanyName('');
      alert('Company registered successfully!');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const reportEmissions = async () => {
    if (!contract || !emissions) return;
    
    setLoading(true);
    try {
      const tx = await contract.reportEmissions(emissions);
      addTransaction(tx.hash, 'Emissions Report', `Reported ${emissions} tons of emissions`);
      await tx.wait();
      await loadUserData(contract, tokenContract, account);
      setEmissions('');
      alert('Emissions reported successfully!');
    } catch (error: any) {
      console.error('Emissions error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const buyCreditsFromContract = async () => {
    if (!contract || !buyAmount) return;
    
    setLoading(true);
    try {
      const tokenPrice = await contract.tokenPrice();
      const totalCost = BigInt(buyAmount) * tokenPrice;
      
      const tx = await contract.buyCredits(buyAmount, { value: totalCost });
      addTransaction(tx.hash, 'Direct Purchase', `Bought ${buyAmount} credits for ${ethers.formatEther(totalCost)} ETH`);
      await tx.wait();
      await loadUserData(contract, tokenContract, account);
      setBuyAmount('');
      alert('Credits purchased successfully!');
    } catch (error: any) {
      console.error('Purchase error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const createListing = async () => {
    if (!contract || !listAmount || !listPrice) return;
    
    setLoading(true);
    try {
      const priceInWei = ethers.parseEther(listPrice);
      const tx = await contract.createListing(listAmount, priceInWei);
      addTransaction(tx.hash, 'Create Listing', `Listed ${listAmount} credits at ${listPrice} ETH each`);
      await tx.wait();
      await loadListings(contract);
      await loadUserData(contract, tokenContract, account);
      setListAmount('');
      setListPrice('');
      alert('Listing created successfully!');
    } catch (error: any) {
      console.error('Listing error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const purchaseFromListing = async (listingId: number, amount: number, pricePerCredit: number) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const totalCost = ethers.parseEther((amount * pricePerCredit).toString());
      const tx = await contract.purchaseFromListing(listingId, amount, { value: totalCost });
      addTransaction(tx.hash, 'Marketplace Purchase', `Bought ${amount} credits for ${amount * pricePerCredit} ETH`);
      await tx.wait();
      await loadListings(contract);
      await loadUserData(contract, tokenContract, account);
      alert('Credits purchased from marketplace!');
    } catch (error: any) {
      console.error('Purchase error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const transferCredits = async () => {
    if (!contract || !transferTo || !transferAmount) return;
    
    setLoading(true);
    try {
      const amountInWei = ethers.parseEther(transferAmount);
      const tx = await contract.transferCredits(transferTo, amountInWei);
      addTransaction(tx.hash, 'P2P Transfer', `Transferred ${transferAmount} credits to ${transferTo.slice(0,6)}...${transferTo.slice(-4)}`);
      await tx.wait();
      await loadUserData(contract, tokenContract, account);
      setTransferTo('');
      setTransferAmount('');
      alert('Credits transferred successfully!');
    } catch (error: any) {
      console.error('Transfer error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (contract && tokenContract) {
            loadUserData(contract, tokenContract, accounts[0]);
          }
        }
      });
    }
  }, [contract, tokenContract]);

  const TabButton = ({ id, label, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Carbon Credit Marketplace
              </h1>
              <p className="text-gray-400 mt-1">Trade carbon credits securely on blockchain</p>
            </div>
            <div className="flex items-center gap-4">
              {account ? (
                <div className="text-right">
                  <div className="text-sm text-gray-400">Connected</div>
                  <div className="font-mono text-purple-300">{account.slice(0,6)}...{account.slice(-4)}</div>
                  <div className="text-sm text-gray-400">Balance: {parseFloat(ethBalance).toFixed(4)} ETH</div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-8">
            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-800/30 p-2 rounded-lg backdrop-blur-sm">
              <TabButton id="dashboard" label="Dashboard" isActive={activeTab === 'dashboard'} onClick={setActiveTab} />
              <TabButton id="marketplace" label="Marketplace" isActive={activeTab === 'marketplace'} onClick={setActiveTab} />
              <TabButton id="sell" label="Sell Credits" isActive={activeTab === 'sell'} onClick={setActiveTab} />
              <TabButton id="transfer" label="P2P Transfer" isActive={activeTab === 'transfer'} onClick={setActiveTab} />
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* User Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Token Balance</h3>
                    <p className="text-3xl font-bold text-purple-300">{parseFloat(tokenBalance).toFixed(2)}</p>
                    <p className="text-sm text-gray-400">Carbon Credits</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Emissions</h3>
                    <p className="text-3xl font-bold text-red-400">{company?.emissions || 0}</p>
                    <p className="text-sm text-gray-400">Tons CO₂</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Company</h3>
                    <p className="text-lg font-bold text-green-400">{company?.isRegistered ? 'Registered' : 'Not Registered'}</p>
                    <p className="text-sm text-gray-400">{company?.name || 'No Name'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Company Registration */}
                  {!company?.isRegistered && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-semibold mb-4 text-purple-300">Register Company</h3>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        onClick={registerCompany}
                        disabled={loading || !companyName.trim()}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? 'Registering...' : 'Register Company'}
                      </button>
                    </div>
                  )}

                  {/* Emissions Reporting */}
                  {company?.isRegistered && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-semibold mb-4 text-purple-300">Report Emissions</h3>
                      <input
                        type="number"
                        placeholder="Emissions (tons)"
                        value={emissions}
                        onChange={(e) => setEmissions(e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-4 focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        onClick={reportEmissions}
                        disabled={loading || !emissions}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? 'Reporting...' : 'Report Emissions'}
                      </button>
                    </div>
                  )}

                  {/* Buy Credits */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Buy Credits (Direct)</h3>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-2 focus:border-purple-500 focus:outline-none"
                    />
                    {buyAmount && (
                      <p className="text-sm text-gray-400 mb-4">Cost: {(parseFloat(buyAmount) * 0.001).toFixed(4)} ETH</p>
                    )}
                    <button
                      onClick={buyCreditsFromContract}
                      disabled={loading || !buyAmount}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? 'Purchasing...' : 'Buy Credits'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Marketplace Tab */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-300">Available Listings</h2>
                <div className="grid gap-4">
                  {listings.length > 0 ? listings.map((listing) => (
                    <div key={listing.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-semibold">Listing #{listing.id}</p>
                          <p className="text-gray-400">Seller: {listing.seller.slice(0,6)}...{listing.seller.slice(-4)}</p>
                          <p className="text-purple-300">Available: {listing.remaining} credits</p>
                          <p className="text-green-400">Price: {listing.pricePerCredit} ETH per credit</p>
                        </div>
                        <div className="text-right space-y-2">
                          <input
                            type="number"
                            placeholder="Amount to buy"
                            max={listing.remaining}
                            className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 w-32 focus:border-purple-500 focus:outline-none"
                            onChange={(e) => {
                              const amount = parseInt(e.target.value) || 0;
                              e.target.setAttribute('data-amount', amount.toString());
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              const amount = parseInt(input.getAttribute('data-amount') || '0');
                              if (amount > 0) {
                                purchaseFromListing(listing.id, amount, listing.pricePerCredit);
                              }
                            }}
                            disabled={loading}
                            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {loading ? 'Buying...' : 'Buy Credits'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-gray-400">
                      <p>No active listings available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sell Credits Tab */}
            {activeTab === 'sell' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-300">Create Listing</h2>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="number"
                      placeholder="Amount to sell"
                      value={listAmount}
                      onChange={(e) => setListAmount(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Price per credit (ETH)"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  {listAmount && listPrice && (
                    <p className="text-sm text-gray-400 mb-4">
                      Total Value: {(parseFloat(listAmount) * parseFloat(listPrice)).toFixed(4)} ETH
                    </p>
                  )}
                  <button
                    onClick={createListing}
                    disabled={loading || !listAmount || !listPrice}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Creating...' : 'Create Listing'}
                  </button>
                </div>
              </div>
            )}

            {/* P2P Transfer Tab */}
            {activeTab === 'transfer' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-purple-300">P2P Transfer</h2>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Amount to transfer"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={transferCredits}
                      disabled={loading || !transferTo || !transferAmount}
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {loading ? 'Transferring...' : 'Transfer Credits'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History Sidebar */}
          <div className="col-span-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 sticky top-8">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Transaction History</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.length > 0 ? transactions.map((tx, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-purple-300">{tx.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        tx.status === 'confirmed' ? 'bg-green-900/50 text-green-300' :
                        tx.status === 'failed' ? 'bg-red-900/50 text-red-300' :
                        'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{tx.details}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {tx.timestamp.toLocaleTimeString()}
                      </span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No transactions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-900/90 backdrop-blur-sm border border-red-700 text-red-200 px-6 py-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-4 text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonMarketplace;