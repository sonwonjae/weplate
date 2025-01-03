export const sleep = async (ms = 1000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, ms);
  });
};
