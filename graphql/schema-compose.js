/*	generates a schema based on the database models for GraphQL using graphql-compose
	NOT YET COMPLETE
*/
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

const typeComposers = require('./composers');
const addRelationships = require('./relationships');
const addResolvers = require('./resolvers');
const addViewers = require('./viewers');

//Get logic middleware
const {
	isSelf,
	updateSelf,
	//createSelfRelationship,
	updateSelfRelationship,
	//findSelfRelationship,
	deleteSelfRelationship,
	createManagedRelationship,
	deleteManagedRelationship
} = require('./logic/common');

const { authAccess } = require('./logic/authentication');

const {
	UserTC,
	// PollTC,
	// PollVoteTC,
	LocalGovernmentTC,
	StateTC,
  PretCandidateTC,
	PretCandidateDocumentTC,
	ViewerPretCandidateTC,
	// InstitutionTC,
	// ViewerInstitutionTC,
	// IndustryTC,
	// AdminTC,
	// ViewerAdminTC,
	PretPaymentTC,
	PretTestCodeTC,
	PretGuestEnquiryTC,
	PretNewsletterSubscriberTC,
	ViewerPretAffiliateTC,
	PretPriceTC
} = typeComposers;

//Add relationships and resolvers to schema
addViewers();
addRelationships();
addResolvers();

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields({
	// user: UserTC.getResolver('findOne'),
	...authAccess({sourceUserType: 'User'}, {
		price: PretPriceTC.getResolver('latestPretPrice'),
		userIsAuthenticated: UserTC.getResolver('isAuthenticated'),
	}),
	...authAccess({sourceUserType: 'PretCandidate'}, {
		candidateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
    viewerPretCandidate: ViewerPretCandidateTC.getResolver('candidateAccess'),
	}),
	...authAccess({sourceUserType: 'PretCandidate', isActivated: true}, {
    isActivatedViewerPretCandidate: ViewerPretCandidateTC.getResolver('candidateAccess'),
	}),
	...authAccess({sourceUserType: 'PretAffiliate'}, {
		pretAffiliateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
		viewerPretAffiliate: ViewerPretAffiliateTC.getResolver('pretAffiliateAccess'),
	}),
	currentTime: {
		type: 'Date',
		resolve: () => new Date().toISOString(),
	},
});

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields({

	// unauthorized User Mutations
	createEnquiry: PretGuestEnquiryTC.getResolver('createOne'),
	subscribeToPretNewsletter: PretNewsletterSubscriberTC.getResolver('subscribe'),
	// unsubscribePretNewsletter: PretNewsletterSubscriberTC.getResolver('unsubscribe'),

	loginUser: UserTC.getResolver('loginWithEmail'),
	userActivateAccount: UserTC.getResolver('activateAccount'),

	// unauthorized PretCandidate Mutations
	candidateCreateAccount: PretCandidateTC.getResolver('createAccount'),
	candidateActivateAccount: PretCandidateTC.getResolver('activateAccount'),

	// loginAdmin: AdminTC.getResolver('loginWithPhone'),
	// signUpAdmin: AdminTC.getResolver('signUp'),

	//authorized User Mutations
	...authAccess({sourceUserType: 'PretCandidate'}, {
		candidateResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		candidateUpdateSelf: updateSelf({TC: PretCandidateTC}),
		candidateFindOrCreatePretPaymentRecord: PretPaymentTC.getResolver('findOrCreatePretPayment'),
	}),
//	...authAccess({sourceUserType: 'Admin'}, {
		// addPretCandidateDocument: createManagedRelationship( 'documentsUploaded', PretCandidateDocumentTC, 'PretCandidate'),
		// deletePretCandidateDocument: deleteManagedRelationship( 'documentsUploaded', PretCandidateDocumentTC, 'PretCandidate'),
		// addPretCandidateCaseFile: createManagedRelationship( 'caseFiles', CaseFileTC, 'PretCandidate'),
		// addPretCandidateDocument: createSelfRelationship( 'referees', PretCandidateDocumentTC),
		// deletePretCandidateDocument: deleteSelfRelationship( 'referees', PretCandidateDocumentTC),
//	})
});

const schema = GQC.buildSchema();
module.exports = schema;
