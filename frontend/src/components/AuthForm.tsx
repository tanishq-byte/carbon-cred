import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pressed, setPressed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // Simulate checking for existing token
    // In your actual app, replace this with: const token = localStorage.getItem("token");
    const token = false; // Demo purposes
    setIsLoggedIn(!!token);
  }, []);

  const handleAuth = async (isLogin) => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    
    // Your existing authentication logic would go here
    console.log(`${isLogin ? 'Login' : 'Signup'} attempt:`, { email, password });
    
    // Simulate API call
    setTimeout(() => {
      alert(`✅ ${isLogin ? "Logged in" : "Registered"} as ${email}`);
      setIsLoggedIn(true);
    }, 1000);
    navigate("/");
  };

  const handleLogout = () => {
    alert("🚪 Logged out");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 text-center transform hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back!</h2>
              <p className="text-gray-600 dark:text-gray-300">You're already logged in</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🚪</span>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
       <div className="max-w-md w-full">
         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 transform hover:scale-105 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-medium transition-all duration-200"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-medium transition-all duration-200"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-0">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📧</span>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔒</span>
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAuth(true);
                  }}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 hover:shadow-xl ${
                    pressed ? "scale-95" : "scale-100"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🚀</span>
                    Login
                  </span>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-0">
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">📧</span>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">🔒</span>
                    </div>
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAuth(false);
                  }}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 hover:shadow-xl ${
                    pressed ? "scale-95" : "scale-100"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>✨</span>
                    Sign Up
                  </span>
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;