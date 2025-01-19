export const setRem = (isMobile: boolean) => {
  if (isMobile) {
    // 移动端：基于390宽度计算
    const baseWidth = 390;
    const scale = document.documentElement.clientWidth / baseWidth;
    const fontSize = 16 * scale;
    document.documentElement.style.fontSize = `${fontSize}px`;
  } else {
    // PC端：基于1440宽度计算
    const baseWidth = 1440;
    const scale = document.documentElement.clientWidth / baseWidth;
    const fontSize = 16 * Math.min(scale, 1); // 当宽度大于1440时保持16px
    document.documentElement.style.fontSize = `${fontSize}px`;
  }
};

export const pxToRem = (px: number) => {
  return `${px / 16}rem`;
}; 