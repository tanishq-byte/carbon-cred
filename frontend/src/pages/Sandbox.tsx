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
    <div className="max-w-md px-4 mx-auto mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30">
          <span className="text-2xl">🧪</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Carbon Sandbox
          </h2>
          <p className="text-sm text-indigo-300">
            Simulate emissions and token generation in a test environment
          </p>
        </div>
      </div>

      <form 
        onSubmit={handleSimulate} 
        className="p-6 space-y-5 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 shadow-2xl shadow-indigo-500/10"
      >
        {[
          { label: "Fuel Consumption (liters)", value: fuel, setter: setFuel, icon: "⛽" },
          { label: "Electricity Usage (kWh)", value: electricity, setter: setElectricity, icon: "⚡" },
          { label: "Waste Production (kg)", value: waste, setter: setWaste, icon: "🗑️" },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <span className="text-lg">{field.icon}</span>
              {field.label}
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              onChange={(e) => field.setter(Number(e.target.value))}
              className="w-full px-4 py-3 text-white bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95"
        >
          Simulate Token Minting
        </button>
      </form>

      {tokens !== null && (
        <div className="p-4 mt-6 text-center bg-zinc-800/50 border border-indigo-500/30 rounded-xl animate-fade-in">
          <div className="text-sm text-indigo-300">Simulation Complete</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {tokens} <span className="text-indigo-400">CC Tokens</span>
          </div>
          <div className="mt-1 text-xs text-indigo-300">
            (1 Token per 10kg CO₂e offset)
          </div>
        </div>
      )}
    </div>
  );
};

export default Sandbox;