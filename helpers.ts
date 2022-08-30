// get allowed test token
export const testToken = (
  range: number,
  generateToken?: boolean
): number | number[] => {
  if (!generateToken) {
    return new Array(range).fill(0).map((item, index) => index + 1);
  }
  return Math.ceil(Math.random() * range);
};
