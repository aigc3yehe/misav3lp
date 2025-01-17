export const setRem = () => {
  const baseWidth = 1440;
  const scale = document.documentElement.clientWidth / baseWidth;
  const fontSize = 16 * Math.min(scale, 1); // 当宽度大于1440时保持16px
  document.documentElement.style.fontSize = `${fontSize}px`;
};

export const pxToRem = (px: number) => {
  return `${px / 16}rem`;
}; 