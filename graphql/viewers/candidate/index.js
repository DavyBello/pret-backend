const { PretCandidateTC, ViewerPretCandidateTC } = require('../../composers');

module.exports = () => {
  ViewerPretCandidateTC.addResolver({
  	kind: 'query',
    name: 'candidateAccess',
    type: ViewerPretCandidateTC,
    resolve: ({ args, context , sourceUser}) => {
  		//console.log('assign candidate from jwt to response');
      return { candidate: sourceUser }
    },
  })

  const ViewerPretCandidateTCFields = {
  	candidate: PretCandidateTC.getType()
  	//add other exclusive to candidate fields here
  }
  ViewerPretCandidateTC.addFields(ViewerPretCandidateTCFields);
}
