const { PretCandidateTC } = require('../../composers');

module.exports = () => {

  PretCandidateTC.addResolver(require('./createAccount'))

  PretCandidateTC.addResolver(require('./activateAccount'))
}
