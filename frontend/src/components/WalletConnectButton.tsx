import { useEffect, useState } from "react";

const WalletConnectButton = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
    >
      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
