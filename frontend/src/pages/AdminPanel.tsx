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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
    {/* Animated background elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>
    
    <div className="relative max-w-6xl px-4 mx-auto pt-10 space-y-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          🛡 AdminPanel
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full"></div>
      </div>
  
      {/* All Users Section */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SYSTEM OPERATIVES
            </h3>
          </div>
          
          {userRole !== 'admin' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-400">⚠</span>
              </div>
              <p className="text-red-400 font-semibold">ACCESS DENIED: Insufficient clearance level.</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◇</span>
              </div>
              <p className="text-purple-300">No operatives in the system.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-purple-400/30">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-purple-400/30">
                    <th className="text-left p-4 text-purple-300 font-semibold uppercase tracking-wide">Contact ID</th>
                    <th className="text-left p-4 text-purple-300 font-semibold uppercase tracking-wide">Clearance</th>
                    <th className="text-left p-4 text-purple-300 font-semibold uppercase tracking-wide">Quantum Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-purple-400/20 hover:bg-purple-900/20 transition-colors">
                      <td className="p-4 text-white font-mono">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          user.role === 'admin' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-purple-300 font-mono">{user.walletAddress || "◊ UNLINKED"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
  
      {/* All Emission Records Section */}
      <section className="relative group mb-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative p-6 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">🌿</span>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              GLOBAL CARBON ARCHIVE
            </h3>
          </div>
          
          {userRole !== 'admin' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-400">⚠</span>
              </div>
              <p className="text-red-400 font-semibold">ACCESS DENIED: Insufficient clearance level.</p>
            </div>
          ) : emissions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◇</span>
              </div>
              <p className="text-purple-300">No emission data streams detected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emissions.map((e, i) => (
                <div key={i} className="group/item hover:scale-[1.01] transition-all duration-300">
                  <div className="p-5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-400/30 rounded-xl backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-purple-300 text-sm uppercase tracking-wide">OPERATIVE</p>
                        <p className="text-white font-semibold font-mono">{e.userId?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-300 text-sm uppercase tracking-wide">TIMESTAMP</p>
                        <p className="text-purple-400 text-sm font-mono">{new Date(e.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-black/20 rounded-lg">
                        <p className="text-xs text-purple-300 uppercase tracking-wide">FUEL</p>
                        <p className="text-white font-bold">{e.fuel} L</p>
                      </div>
                      <div className="text-center p-3 bg-black/20 rounded-lg">
                        <p className="text-xs text-purple-300 uppercase tracking-wide">ENERGY</p>
                        <p className="text-white font-bold">{e.electricity} kWh</p>
                      </div>
                      <div className="text-center p-3 bg-black/20 rounded-lg">
                        <p className="text-xs text-purple-300 uppercase tracking-wide">WASTE</p>
                        <p className="text-white font-bold">{e.waste} kg</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-purple-400/20 pt-4">
                      <p className="text-center">
                        <span className="text-purple-300 text-sm">TOTAL CARBON FOOTPRINT: </span>
                        <span className="text-red-400 font-bold text-xl">{e.totalCO2e} kg CO₂e</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  </div>
  );
};

export default AdminPanel;
