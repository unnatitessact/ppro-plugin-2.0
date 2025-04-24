const COLUMNS = 10;
const ROWS = 10;

export const generateSprites = (spriteWidth: number, spriteHeight: number) => {
  const sprites = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      sprites.push({
        top: i * spriteHeight,
        left: j * spriteWidth
      });
    }
  }
  return sprites;
};

export const distributeSprites = (min: number, max: number, count: number): number[] => {
  if (count <= 0) return [];
  if (count === 1) return [min];

  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const value = min + i * step;
    return Math.min(Math.round(value), max);
  });
};

export const generateSpritesCustom = (
  spriteWidth: number,
  spriteHeight: number,
  rows: number,
  columns: number
) => {
  const sprites = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      sprites.push({
        top: i * spriteHeight,
        left: j * spriteWidth
      });
    }
  }
  return sprites;
};
