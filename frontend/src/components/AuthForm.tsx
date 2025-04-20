// components/AuthForm.tsx
import { useEffect, useState } from "react";
//import { auth } from "../firebase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import API from "../lib/axios";
//import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// const AuthForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLogin, setIsLogin] = useState(true);
//   const [pressed, setPressed] = useState(false);

  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // try {
//     //   if (isLogin) {
//     //     await signInWithEmailAndPassword(auth, email, password);
//     //   } else {
//     //     await createUserWithEmailAndPassword(auth, email, password);
//     //   }
//     // } catch (err) {
//     //   alert("Error: " + err);
//     // }
//     setPressed(true);
//     setTimeout(() => setPressed(false), 200);

//     try {
//         if (isLogin) {
//           const userCredential = await signInWithEmailAndPassword(auth, email, password);
//           alert(`✅ You are successfully logged in as ${userCredential.user.email}`);
//         } else {
//           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//           alert(`✅ Account created successfully for ${userCredential.user.email}`);
//         }
//       } catch (err: any) {
//         alert("❌ Error: " + err.message);
//       }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm p-4 mx-auto space-y-2">
//       <input type="email" placeholder="Email" className="w-full p-2 border" onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" className="w-full p-2 border" onChange={(e) => setPassword(e.target.value)} />
//       <button type="submit" className={`w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded transition-transform duration-200 ${
//           pressed ? "scale-98" : "scale-100"
//         }`}>
//         {isLogin ? "Login" : "Sign Up"}
//       </button>
//       <p className="text-sm text-center underline cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
//       </p>
//     </form>
//   );
// };

// export default AuthForm;




// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { useState } from "react";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";



const AuthForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pressed, setPressed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }, [] );

    const handleAuth = async (isLogin: boolean) => {
        setPressed(true);
        setTimeout(() => setPressed(false), 200);
    
        try {
          const route = isLogin ? "login" : "register";
          const res = await API.post(`/auth/${route}`, { email, password });
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);  // <--- this is what was missing!
          setTimeout(() => {
            navigate("/dashboard");
            window.location.reload();
          }, 1000);
          //window.location.reload(); // optional: isse force refresh hota h

          alert(`✅ ${isLogin ? "Logged in" : "Registered"} as ${email}`);
        } catch (err: any) {
          alert("❌ Error: " + err.response?.data?.error || err.message);
        };
        setIsLoggedIn(true);

        
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("🚪 Logged out");
      setIsLoggedIn(false);

      setTimeout(() => {
        navigate("/");
      }, 1000);

      window.location.reload(); // optional: isse force refresh hota h


    };

    if (isLoggedIn) {
      return (
        <div className="max-w-md p-6 mx-auto mt-16 bg-white shadow-md dark:bg-zinc-900 rounded-xl text-center">
          <p className="mb-4 text-lg">✅ You're already logged in.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      );
    }


    // const handleLogin = async () => {
    //   setPressed(true);
    //   setTimeout(() => setPressed(false), 200);
  
    //   try {
    //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //     alert(`✅ Logged in as ${userCredential.user.email}`);
    //   } catch (err: any) {
    //     alert("❌ Login Error: " + err.message);
    //   }
    // };
  
    // const handleSignup = async () => {
    //   setPressed(true);
    //   setTimeout(() => setPressed(false), 200);
  
    //   try {
    //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //     alert(`✅ Account created for ${userCredential.user.email}`);
    //   } catch (err: any) {
    //     alert("❌ Signup Error: " + err.message);
    //   }
    // };
  
    return (
      <div className="max-w-md p-6 mx-auto mt-16 bg-white shadow-md dark:bg-zinc-900 rounded-xl">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
  
          <TabsContent value="login">
            <form className="space-y-3" onSubmit={(e) => { 
              e.preventDefault(); 
              // handleLogin(); 
              handleAuth(true) }}>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className={`w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 transition-transform duration-200 ${
                  pressed ? "scale-95" : "scale-100"
                }`}
              >
                Login
              </button>
            </form>
          </TabsContent>
  
          <TabsContent value="signup">
            <form className="space-y-3" onSubmit={(e) => { 
              e.preventDefault(); 
              //handleSignup(); 
              handleAuth(false) }}>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className={`w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-transform duration-200 ${
                  pressed ? "scale-95" : "scale-100"
                }`}
              >
                Sign Up
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    );
  };



  export default AuthForm;

// const AuthForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = async () => {
//     try {
//       const userCred = await createUserWithEmailAndPassword(auth, email, password);
//       console.log("Signed up:", userCred.user);
//       // TODO: Add to Firestore with role (default: credit-holder)
//     } catch (err) {
//       alert("Signup Error: " + err);
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const userCred = await signInWithEmailAndPassword(auth, email, password);
//       console.log("Logged in:", userCred.user);
//     } catch (err) {
//       alert("Login Error: " + err);
//     }
//   };

//   return (
//     <div className="max-w-md p-6 mx-auto mt-16 bg-white shadow-md dark:bg-zinc-900 rounded-xl">
//       <Tabs defaultValue="login" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 mb-4">
//           <TabsTrigger value="login">Login</TabsTrigger>
//           <TabsTrigger value="signup">Sign Up</TabsTrigger>
//         </TabsList>

//         <TabsContent value="login">
//           <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full px-3 py-2 border rounded"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full px-3 py-2 border rounded"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button type="submit" className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700">
//               Login
//             </button>
//           </form>
//         </TabsContent>

//         <TabsContent value="signup">
//           <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full px-3 py-2 border rounded"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full px-3 py-2 border rounded"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
//               Sign Up
//             </button>
//           </form>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };






