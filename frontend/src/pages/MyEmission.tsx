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
    <div className="max-w-4xl px-4 mx-auto mt-10 space-y-8">
      <h2 className="text-2xl font-bold">📊 Dashboard</h2>

      <div className="p-4 bg-white border rounded-md shadow dark:bg-zinc-900">
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Wallet:</strong> {wallet ? formatAddress(wallet) : "Not connected"}</p>
      </div>

      <div className="p-4 bg-white border rounded-md shadow dark:bg-zinc-900">
        <h3 className="mb-2 text-lg font-semibold">🌱 Emission History</h3>
        {emissions.length === 0 ? (
          <p>No records yet.</p>
        ) : (
          <ul className="space-y-2">
            {emissions.map((emission, idx) => (
              <li key={idx} className="p-3 border rounded bg-gray-50 dark:bg-zinc-800">
                <p>Fuel: {emission.fuel} L, Electricity: {emission.electricity} kWh, Waste: {emission.waste} kg</p>
                <p><strong>Total CO₂e:</strong> {emission.totalCO2e.toFixed(2)} kg</p>
                <p className="text-xs text-gray-500">Date: {new Date(emission.submittedAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 bg-white border rounded-md shadow dark:bg-zinc-900">
        <h3 className="mb-2 text-lg font-semibold">💰 Token Activity</h3>
        {tokens.length === 0 ? (
          <p>No token transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {tokens.map((token, idx) => (
              <li key={idx} className="p-3 border rounded bg-gray-50 dark:bg-zinc-800">
                <p><strong>Type:</strong> {token.transactionType}</p>
                <p><strong>Amount:</strong> {token.amount}</p>
                <p className="text-xs text-gray-500">Time: {new Date(token.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyEmission;
