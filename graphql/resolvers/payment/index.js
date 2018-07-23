const { PretPaymentTC } = require('../../composers');

module.exports = () => {
  // Queries
  // PretPaymentTC.addResolver(require('./isAuthenticated'));

  // Mutations
  PretPaymentTC.addResolver(require('./findOrCreatePayment'));
}
