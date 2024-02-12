const { get, pipe, defaultTo, defaults, isNaN, mapValues, omitBy } = require('lodash/fp');

const toInt = (input) => {
  const value = parseInt(input, 10);

  return isNaN(value)
    ? undefined
    : value;
};

const extractQueryParams = pipe(
  get('query.page'),
  defaultTo({}),
  mapValues(toInt),
  omitBy((it) => it === 0),
  defaults({ size: 10, number: 1 }),
  ({ size, number }) => ({ size, number, limit: size, skip: (number - 1) * size })
);

const definePagination = (req, res, next) => {
  req.query.pagination = extractQueryParams(req);

  return next();
};

module.exports = definePagination;
