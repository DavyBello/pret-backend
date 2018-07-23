const { PretPriceTC } = require('../../composers');

module.exports = () => {
  // Queries
  PretPriceTC.addResolver(require('./latestPrice'));
}
