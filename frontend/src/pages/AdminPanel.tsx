// AdminPAnel.tsx
import { useEffect, useState } from "react";
import API from "../lib/axios";

interface User {
  _id: string;
  email: string;
  role: string;
  walletAddress?: string;
}

interface Emission {
  userId: {
    _id: string;
    email: string;
  } | null;
  fuel: number;
  electricity: number;
  waste: number;
  totalCO2e: number;
  submittedAt: string;
}

const AdminPanel = () => {
  const userRole = localStorage.getItem("role");
  const [users, setUsers] = useState<User[]>([]);
  const [emissions, setEmissions] = useState<Emission[]>([]);
  console.log(userRole);
  useEffect(() => {
    console.log("Token in localStorage:", localStorage.getItem("token"));
    fetchAllUsers();
    fetchAllEmissions();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err: any) {
      console.log("Error loading users: " + err.message);
    }
  };

  const fetchAllEmissions = async () => {
    try {
      const res = await API.get("/admin/emissions");
      setEmissions(res.data);
    } catch (err: any) {
      console.log("Error loading emissions: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl px-4 mx-auto mt-10 space-y-10">
      {<h2 className="text-2xl font-bold">🛡 Admin Panel</h2>}

      <section className="p-5 bg-white rounded shadow dark:bg-zinc-900">
        <h3 className="mb-2 text-lg font-semibold">👥 All Users</h3>
        {userRole !== 'admin' ? (
          <p className="text-red-500">Restricted: You do not have access to view this content.</p>
        ) :users.length === 0 ? (
          <p>No users yet.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300">
                <th>Email</th>
                <th>Role</th>
                <th>Wallet</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-300 dark:border-zinc-700">
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>{user.walletAddress || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="p-5 bg-white rounded shadow dark:bg-zinc-900">
        <h3 className="mb-2 text-lg font-semibold">🌿 All Emission Records</h3>
        {userRole !== 'admin' ? (
          <p className="text-red-500">Restricted: You do not have access to view this content.</p>
        ) : emissions.length === 0 ? (
          <p>No emission data submitted yet.</p>
        ) : (
          <ul className="space-y-2">
            {emissions.map((e, i) => (
              <li key={i} className="p-3 border rounded bg-gray-50 dark:bg-zinc-800">
                <p><strong>User:</strong> {e.userId?.email}</p> {/* Rendering the user's email */}
                <p>Fuel: {e.fuel} L, Electricity: {e.electricity} kWh, Waste: {e.waste} kg</p>
                <p>Total CO₂e: <strong>{e.totalCO2e} kg</strong></p>
                <p className="text-xs text-gray-500">Date: {new Date(e.submittedAt).toLocaleString()}</p>
              </li>
            ))}

          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
