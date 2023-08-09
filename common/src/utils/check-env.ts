export const checkEnv = (...vars: string[]) => {
  for (const variable of vars) {
    if (!process.env[variable])
      throw new Error(`Invalid environment: ${variable} is not defined`);
  }
};