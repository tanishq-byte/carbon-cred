import { useEffect, useState } from "react";
import { formatAddress } from "../utils/formatAddress";

interface TokenListing {
  id: number;
  project: string;
  amount: number;
  price: number; // simulated price
}

const dummyTokens: TokenListing[] = [
  { id: 1, project: "Reforest India", amount: 20, price: 12.5 },
  { id: 2, project: "Solar Clean Grid", amount: 50, price: 10.75 },
  { id: 3, project: "Zero-Waste Campaign", amount: 30, price: 11.3 },
];

const Marketplace = () => {
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      setWallet(window.ethereum.selectedAddress);
    }
  }, []);

  const handleBuy = (token: TokenListing) => {
    alert(`✅ You bought ${token.amount} kg CO₂e from ${token.project} at ₹${token.price}/credit`);
    // TODO: Integrate smart contract swap or backend transaction here
  };

  return (
    <div className="max-w-4xl px-4 mx-auto mt-10">
      <h2 className="mb-4 text-2xl font-bold">🛒 Carbon Credit Marketplace</h2>

      {wallet ? (
        <p className="mb-6 text-sm text-gray-500">
          Connected Wallet: <span className="font-medium">{formatAddress(wallet)}</span>
        </p>
      ) : (
        <p className="mb-6 text-sm text-red-500">Please connect your wallet to buy credits.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dummyTokens.map((token) => (
          <div key={token.id} className="p-4 bg-white border rounded shadow dark:bg-zinc-900">
            <h3 className="text-lg font-semibold">{token.project}</h3>
            <p>💨 <strong>{token.amount} kg CO₂e</strong></p>
            <p>💰 <strong>₹{token.price} / credit</strong></p>
            <button
              onClick={() => handleBuy(token)}
              disabled={!wallet}
              className={`mt-3 w-full py-2 rounded font-medium text-white ${
                wallet ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {wallet ? "Buy Now" : "Connect Wallet"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
