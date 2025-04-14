// components/AuthForm.tsx
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [pressed, setPressed] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   if (isLogin) {
    //     await signInWithEmailAndPassword(auth, email, password);
    //   } else {
    //     await createUserWithEmailAndPassword(auth, email, password);
    //   }
    // } catch (err) {
    //   alert("Error: " + err);
    // }
    setPressed(true);
    setTimeout(() => setPressed(false), 200);

    try {
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          alert(`✅ You are successfully logged in as ${userCredential.user.email}`);
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          alert(`✅ Account created successfully for ${userCredential.user.email}`);
        }
      } catch (err: any) {
        alert("❌ Error: " + err.message);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm p-4 mx-auto space-y-2">
      <input type="email" placeholder="Email" className="w-full p-2 border" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="w-full p-2 border" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className={`w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded transition-transform duration-200 ${
          pressed ? "scale-98" : "scale-100"
        }`}>
        {isLogin ? "Login" : "Sign Up"}
      </button>
      <p className="text-sm text-center underline cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </p>
    </form>
  );
};

export default AuthForm;
