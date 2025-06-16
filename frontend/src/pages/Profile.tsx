import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  email: string;
  role: "credit-holder" | "validator" | "buyer" | "issuer" | "admin";
  walletAddress: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [wallet, setWallet] = useState<string | null>(null);
  const navigate = useNavigate();
  
    useEffect(() => {
      if (window.ethereum?.selectedAddress) {
        setWallet(window.ethereum.selectedAddress);
      }
    }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get<UserProfile>(
          "http://localhost:3000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoaderCircle className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-red-400">Authentication Required</h3>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-2 w-full">
              <button 
                onClick={() => navigate("/authform")} 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                Go to Login
              </button>
              
              <button 
                onClick={() => setError("")} 
                className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-300 hover:bg-slate-800/50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className="text-red-500 flex items-center gap-2 justify-center mt-10">
    //     <AlertCircle className="text-red-500" /> {error}
    //     <button onClick={() => {navigate("/authform");}} className="ml-4 text-blue-500 hover:underline">
    //       Login first
    //     </button>
    //     <button 
    //       onClick={() => setError("")} 
    //       className="ml-4 text-blue-500 hover:underline"
    //     >
    //       Dismiss
    //     </button>
        
    //   </div>
    // );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <Card className="shadow-lg border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-3xl font-bold text-gray-300 flex items-center gap-2">
            👤 User Profile
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 border">
              <p className="text-sm text-gray-50 mb-1">📧 Email</p>
              <p className="text-base font-semibold text-gray-300 break-all">
                {profile?.email} 
              </p>
            </div>
  
            <div className="bg-gray-800 rounded-xl p-4 border">
              <p className="text-sm text-gray-50 mb-1">🛡️ Role</p>
              <p className="text-base font-semibold text-gray-300 capitalize">
                {profile?.role}
              </p>
            </div>
  
            <div className="bg-gray-800 rounded-xl p-4 border sm:col-span-2">
              <p className="text-sm text-gray-50 mb-1">💼 Wallet Address</p>
              <p className="text-base font-mono text-gray-50 break-all">
                {profile?.walletAddress || wallet || "Not linked"}
              </p> 
            </div>
          </div>
  
          {/* Optional: Add edit or logout actions here */}
          {/* <Button variant="outline" className="w-full mt-4">Edit Profile</Button> */}
        </CardContent>
      </Card>
    </div>
  );
  
};

export default Profile;
