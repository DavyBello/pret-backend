const { PretNotificationTC } = require('../../composers');

module.exports = () => {

  PretNotificationTC.addResolver(require('./userNotifications'))

}
