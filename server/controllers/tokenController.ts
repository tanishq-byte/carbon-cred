// server/controllers/tokenController.ts
import Token from "../models/Token";

export const getUserTokens = async (req: any, res: any) => {
  try {
    const tokens = await Token.find({ userId: req.user.userId });
    res.status(200).json(tokens);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};