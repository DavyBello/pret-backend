const { PretAffiliateTC, ViewerPretAffiliateTC } = require('../../composers');

module.exports = () => {
  ViewerPretAffiliateTC.addResolver({
  	kind: 'query',
    name: 'pretAffiliateAccess',
    type: ViewerPretAffiliateTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('assign pretAffiliate from jwt to response');
      return { pretAffiliate: sourceUser }
    },
  })

  const ViewerPretAffiliateTCFields = {
  	pretAffiliate: PretAffiliateTC.getType()
  	//add other exclusive to pretAffiliate fields here
  }
  ViewerPretAffiliateTC.addFields(ViewerPretAffiliateTCFields);
}
