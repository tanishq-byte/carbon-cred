export type Role = "credit-holder" | "validator" | "buyer" | "issuer" | "admin";

export interface User {
  uid: string;
  email: string;
  role: Role;
  walletAddress: string;
}
