import Emission from "../models/Emission";
export const submitEmission = async (req: any, res: any) => {
  const { fuel, electricity, waste } = req.body;
  const totalCO2e = fuel * 2.3 + electricity * 0.7 + waste * 1.5;

  try {
    const record = await Emission.create({
      userId: req.user.userId,
      fuel,
      electricity,
      waste,
      totalCO2e,
    });
    res.status(201).json(record);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

export const getUserEmissions = async (req: any, res: any) => {
  try {
    const records = await Emission.find({ userId: req.user.userId });
    res.status(200).json(records);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};