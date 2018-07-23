const candidateViewer = require('./candidate');
// const institutionViewer = require('./institution');
// const adminViewer = require('./admin');
const pretAffiliateViewer = require('./pretAffiliate');

const addViewers = module.exports = () => {
  candidateViewer();
  // institutionViewer();
  pretAffiliateViewer();
  // adminViewer();
};
