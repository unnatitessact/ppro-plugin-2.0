const colors = [
  'bg-ds-combination-pink-subtle-bg',
  'bg-ds-combination-green-subtle-bg',
  'bg-ds-combination-purple-subtle-bg',
  'bg-ds-combination-red-subtle-bg',
  'bg-ds-combination-teal-subtle-bg',
  'bg-ds-combination-amber-subtle-bg'
];

export const hashToGetColor = (tagId: string) => {
  return colors[tagId.charCodeAt(0) % colors.length];
};
