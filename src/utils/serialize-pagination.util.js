const { isEmpty } = require('lodash/fp');

const serializePagination = (
  {
    params: {
      total,
      limit,
      number,
      skip
    },
    data = {}
  }
) => {
  const pagination = {};

  if (number * limit < total) {
    pagination.next = {
      number: number + 1,
      size: total - skip - limit
    };
  }

  if (skip > 0) {
    pagination.prev = {
      number: number - 1,
      size: skip
    };
  }

  return {
    total,
    pagination: isEmpty(pagination) ? undefined : pagination,
    data
  };
};

module.exports = serializePagination;
