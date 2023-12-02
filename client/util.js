export const listEq = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  if (!a.every((e) => b.includes(e))) {
    return false;
  }
  return true;
};
