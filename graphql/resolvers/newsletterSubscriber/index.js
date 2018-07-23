const { PretNewsletterSubscriberTC } = require('../../composers');

module.exports = () => {
  // Mutations
  // PretNewsletterSubscriberTC.addResolver(require('./unsubscribe'));
  PretNewsletterSubscriberTC.addResolver(require('./subscribe'));
}
