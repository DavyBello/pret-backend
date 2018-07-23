const userResolvers = require('./user')
const candidateResolvers = require('./candidate')
const placeholderResolvers = require('./placeholder')
const paymentResolvers = require('./payment')
// const institutionResolvers = require('./institution')
const newsletterSubscriberResolvers = require('./newsletterSubscriber')
const notificationResolvers = require('./notification')
const priceResolvers = require('./price')
// const AdminResolvers = require('./admin')

module.exports = addResolvers = () => {
  userResolvers();
  paymentResolvers();
  placeholderResolvers();
  candidateResolvers();
  // institutionResolvers();
  notificationResolvers();
  newsletterSubscriberResolvers();
  priceResolvers();
  // AdminResolvers();
}
