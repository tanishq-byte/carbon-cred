export const validateEmissionInputs = (fuel: number, electricity: number, waste: number): boolean => {
    return fuel >= 0 && electricity >= 0 && waste >= 0;
  };
  