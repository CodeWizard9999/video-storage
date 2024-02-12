const asyncMap = (cb) => async (items) => {
  const response = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    // eslint-disable-next-line no-await-in-loop
    const result = await cb(item);
    response.push(result);
  }
  return response;
};

module.exports = {
  asyncMap
};
