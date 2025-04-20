import { useState } from "react";

const Sandbox = () => {
  const [fuel, setFuel] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [waste, setWaste] = useState(0);
  const [tokens, setTokens] = useState<number | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const co2 = fuel * 2.3 + electricity * 0.7 + waste * 1.5;
    const minted = parseFloat((co2 / 10).toFixed(2)); // 1 token per 10 kg CO₂e
    setTokens(minted);
  };

  return (
    <div className="max-w-xl px-4 mx-auto mt-10">
      <h2 className="mb-4 text-2xl font-bold">🧪 Sandbox Mode</h2>
      <p className="mb-6 text-sm text-blue-600">
        Simulate emissions and token generation without affecting live data.
      </p>

      <form onSubmit={handleSimulate} className="p-6 space-y-4 bg-white rounded shadow dark:bg-zinc-900">
        <div>
          <label className="block font-semibold">Fuel (liters)</label>
          <input type="number" min="0" placeholder="0" onChange={(e) => setFuel(Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
          {/* <input type="number" min="0" value={fuel} onChange={(e) => setFuel(Number(e.target.value))} className="w-full px-3 py-2 border rounded" /> */}
        </div>

        <div>
          <label className="block font-semibold">Electricity (kWh)</label>
          <input type="number" min="0" placeholder="0" onChange={(e) => setElectricity(Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
          {/* <input type="number" min="0" value={electricity} onChange={(e) => setElectricity(Number(e.target.value))} className="w-full px-3 py-2 border rounded" /> */}
        </div>

        <div>
          <label className="block font-semibold">Waste (kg)</label>
          <input type="number" min="0" placeholder="0" onChange={(e) => setWaste(Number(e.target.value))} className="w-full px-3 py-2 border rounded" />
          {/* <input type="number" min="0" value={waste} onChange={(e) => setWaste(Number(e.target.value))} className="w-full px-3 py-2 border rounded" /> */}
        </div>

        <button type="submit" className="w-full py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
          Simulate Token Minting
        </button>
      </form>

      {tokens !== null && (
        <div className="p-4 mt-4 text-green-800 bg-green-100 border border-green-300 rounded">
          ✅ Estimated Tokens Minted: <strong>{tokens}</strong>
        </div>
      )}
    </div>
  );
};

export default Sandbox;
