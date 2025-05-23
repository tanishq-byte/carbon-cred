import jwt from "jsonwebtoken";

export const authenticateJWT = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
    } catch (err: unknown) {
      const error = err as Error;
      res.status(403).json({ error: error.message });
    }
  };