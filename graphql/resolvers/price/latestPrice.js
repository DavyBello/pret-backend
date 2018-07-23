const { PretPriceTC } = require('../../composers');
const keystone = require('keystone');
const PretPrice = keystone.list('PretPrice').model;

module.exports = {
  kind: 'query',
  name: 'latestPretPrice',
  description: 'returns the most recent price in the database',
  type: PretPriceTC,
  resolve: () => PretPrice.findOne().sort({createdAt: -1})
}
