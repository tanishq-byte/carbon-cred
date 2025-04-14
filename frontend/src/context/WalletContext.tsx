import { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  account: string | null;
  connectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  account: null,
  connectWallet: () => {},
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
