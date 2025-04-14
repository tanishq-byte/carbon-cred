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
    <div className="max-w-xl p-6 mx-auto mt-12 bg-white rounded-lg shadow dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-bold">🧮 Emission Calculator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Fuel Usage (liters)</label>
          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block font-semibold">Electricity (kWh)</label>
          <input
            type="number"
            value={electricity}
            onChange={(e) => setElectricity(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block font-semibold">Waste (kg)</label>
          <input
            type="number"
            value={waste}
            onChange={(e) => setWaste(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            min="0"
          />
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300">
          💨 <strong>Total CO₂e:</strong> {totalCO2e.toFixed(2)} kg
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-semibold text-white transition duration-200 bg-green-600 rounded hover:bg-green-700"
        >
          {loading ? "Submitting..." : "Submit Emission"}
        </button>
      </form>

      {success && (
        <div className="p-3 mt-4 text-green-700 bg-green-100 border border-green-300 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default EmissionForm;
