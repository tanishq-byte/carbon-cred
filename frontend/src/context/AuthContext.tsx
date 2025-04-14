import { createContext, useContext } from "react";
import { User } from "firebase/auth";

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export const useAuthContext = () => useContext(AuthContext);
