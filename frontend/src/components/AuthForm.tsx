import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { AlertCircle, LogIn, UserPlus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../lib/axios";

const AuthForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pressed, setPressed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }, []);

    const handleAuth = async (isLogin: boolean) => {
        setPressed(true);
        setTimeout(() => setPressed(false), 200);
    
        try {
          const route = isLogin ? "login" : "register";
          const res = await API.post(`/auth/${route}`, { email, password });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);  
          localStorage.setItem("userId", res.data.userId); 
          setIsLoggedIn(true);
          
          setTimeout(() => {
            navigate("/profile");
            window.location.reload();
          }, 1000);

          alert(`✅ ${isLogin ? "Logged in" : "Registered"} as ${email}`);
        } catch (err: any) {
          alert("❌ Error: " + err.response?.data?.error || err.message);
        }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("🚪 Logged out");
      setIsLoggedIn(false);

      setTimeout(() => {
        navigate("/authform");
      }, 1000);
      window.location.reload(); 
    };

    if (isLoggedIn) {
      return (
        <div className="max-w-md p-8 mx-auto mt-16 space-y-6 text-center bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 shadow-xl">
          <div className="p-4 mx-auto rounded-full bg-emerald-500/20 w-fit">
            <LogIn className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">Welcome back!</h2>
          <p className="text-zinc-400">You're already authenticated</p>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 mt-4 font-medium text-white transition-all duration-300 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:shadow-lg hover:shadow-red-500/20 hover:scale-[1.02] active:scale-95"
          >
            <LogOut className="inline w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-md p-8 mx-auto mt-16 space-y-6 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            CarbonCred
          </h1>
          <p className="text-zinc-400">Manage your carbon footprint</p>
        </div>

        <Tabs defaultValue="login" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-zinc-800 rounded-xl">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm rounded-lg transition-all"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="login">
            <form className="space-y-4" onSubmit={(e) => { 
              e.preventDefault(); 
              handleAuth(true);
            }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full px-6 py-3 mt-2 font-medium text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 ${
                  pressed ? "scale-95" : "hover:scale-[1.02]"
                }`}
              >
                Continue
              </button>
            </form>
          </TabsContent>
  
          <TabsContent value="signup">
            <form className="space-y-4" onSubmit={(e) => { 
              e.preventDefault(); 
              handleAuth(false);
            }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-zinc-200 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full px-6 py-3 mt-2 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 ${
                  pressed ? "scale-95" : "hover:scale-[1.02]"
                }`}
              >
                Create Account
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    );
};

export default AuthForm;



// import { useEffect, useState } from "react";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import API from "../lib/axios";
// import { useNavigate } from "react-router-dom";

// const AuthForm = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [pressed, setPressed] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     useEffect(() => {
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(!!token);
//     }, [] );

//     const handleAuth = async (isLogin: boolean) => {
//         setPressed(true);
//         setTimeout(() => setPressed(false), 200);
    
//         try {
//           const route = isLogin ? "login" : "register";
//           const res = await API.post(`/auth/${route}`, { email, password });
//           localStorage.setItem("token", res.data.token);
//           localStorage.setItem("role", res.data.role);  
//           //if (res.data.userId) {
//             localStorage.setItem("userId", res.data.userId); 
//           //}
//           setIsLoggedIn(true);
//           console.log("🚀 ~ file: AuthForm.tsx:42 ~ handleAuth ~ res.data:", res.data);
//           setTimeout(() => {
//             navigate("/profile");
//             window.location.reload();
//           }, 1000);
//           //window.location.reload(); // optional: isse force refresh hota h

//           alert(`✅ ${isLogin ? "Logged in" : "Registered"} as ${email}`);
//         } catch (err: any) {
//           alert("❌ Error: " + err.response?.data?.error || err.message);
//         }

        
//     };

//     const handleLogout = () => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("role");
//       alert("🚪 Logged out");
//       setIsLoggedIn(false);

//       setTimeout(() => {
//         navigate("/");
//       }, 1000);
//       window.location.reload(); 
//     };

//     if (isLoggedIn) {
//       return (
//         <div className="max-w-md p-6 mx-auto mt-16 bg-white shadow-md dark:bg-zinc-900 rounded-xl text-center">
//           <p className="mb-4 text-lg">✅ You're already logged in.</p>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
//           >
//             Logout
//           </button>
//         </div>
//       );
//     }

//     return (
//       <div className="max-w-md p-6 mx-auto mt-16 bg-white shadow-md dark:bg-zinc-900 rounded-xl">
//         <Tabs defaultValue="login" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-4">
//             <TabsTrigger value="login">Login</TabsTrigger>
//             <TabsTrigger value="signup">Sign Up</TabsTrigger>
//           </TabsList>
  
//           <TabsContent value="login">
//             <form className="space-y-3" onSubmit={(e) => { 
//               e.preventDefault(); 
//               // handleLogin(); 
//               handleAuth(true) }}>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-3 py-2 border rounded"
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full px-3 py-2 border rounded"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className={`w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-transform duration-200 ${
//                   pressed ? "scale-95" : "scale-100"
//                 }`}
//               >
//                 Login
//               </button>
//             </form>
//           </TabsContent>
  
//           <TabsContent value="signup">
//             <form className="space-y-3" onSubmit={(e) => { 
//               e.preventDefault(); 
//               //handleSignup(); 
//               handleAuth(false) }}>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-3 py-2 border rounded"
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full px-3 py-2 border rounded"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className={`w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-transform duration-200 ${
//                   pressed ? "scale-95" : "scale-100"
//                 }`}
//               >
//                 Sign Up
//               </button>
//             </form>
//           </TabsContent>
//         </Tabs>
//       </div>
//     );
//   };



//   export default AuthForm;