// utils/decodeToken.ts
export const decodeToken = (): { role: string; userId: string } | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return { role: decoded.role, userId: decoded.userId };
    } catch {
      return null;
    }
  };
  