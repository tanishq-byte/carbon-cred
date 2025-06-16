import { useState } from "react";
import API from "../lib/axios";

const EmissionForm = () => {
  const [fuel, setFuel] = useState<number>(0);
  const [electricity, setElectricity] = useState<number>(0);
  const [waste, setWaste] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const totalCO2e = fuel * 2.3 + electricity * 0.7 + waste * 1.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/emissions/submit", {
        fuel,
        electricity,
        waste,
      });
      setSuccess(`✅ Submitted! Your total CO₂e is ${res.data.totalCO2e.toFixed(2)} kg`);
      alert(`✅ Submitted! Your total CO₂e is ${res.data.totalCO2e.toFixed(2)} kg`);
      setFuel(0);
      setElectricity(0);
      setWaste(0);
    } catch (err: any) {
      alert("❌ Submission Error: " + err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto mt-12 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-emerald-500/20">
          <span className="text-xl">🧮</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Carbon Emission Calculator
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Fuel Usage (liters)", value: fuel, setter: setFuel, icon: "⛽" },
          { label: "Electricity (kWh)", value: electricity, setter: setElectricity, icon: "💡" },
          { label: "Waste (kg)", value: waste, setter: setWaste, icon: "🗑️" },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <span className="text-lg">{field.icon}</span>
              {field.label}
            </label>
            <input
              type="number"
              placeholder="0"
              value={field.value || ""}
              onChange={(e) => field.setter(Number(e.target.value))}
              className="w-full px-4 py-3 text-white bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              min="0"
            />
          </div>
        ))}

        <div className="p-4 text-center bg-zinc-800/50 rounded-xl border border-zinc-700">
          <div className="text-sm text-zinc-400">Estimated Carbon Footprint</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">
            {totalCO2e.toFixed(2)} <span className="text-sm font-normal text-zinc-400">kg CO₂e</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 font-medium text-white transition-all duration-300 rounded-xl ${
            loading
              ? "bg-emerald-700 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Submit Emission Data"
          )}
        </button>
      </form>

      {success && (
        <div className="p-4 mt-6 text-emerald-400 bg-emerald-900/30 border border-emerald-800 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionForm;
