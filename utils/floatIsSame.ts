export const floatIsSame = (a: number, b: number, epsilon = 0.0001) => {
  return Math.abs(a - b) < epsilon;
};
