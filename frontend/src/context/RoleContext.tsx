import { createContext, useContext, useState } from "react";

type Role = "credit-holder" | "validator" | "buyer" | "issuer" | "admin" | null;

const RoleContext = createContext<{
  role: Role;
  setRole: (r: Role) => void;
}>({
  role: null,
  setRole: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
