const { composeWithMongoose } = require('graphql-compose-mongoose');
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

/**
* Mongoose Models
*/
const User = keystone.list('User').model;
const LocalGovernment = keystone.list('LocalGovernment').model;
const State = keystone.list('State').model;
const PretCandidate = keystone.list('PretCandidate').model;
const PretAffiliate = keystone.list('PretAffiliate').model;
const PretCoupon = keystone.list('PretCoupon').model;
// const Admin = keystone.list('Admin').model;
// const Institution = keystone.list('Institution').model;
// const InstitutionMessage = keystone.list('InstitutionMessage').model;
// const Industry = keystone.list('Industry').model;
const PretPayment = keystone.list('PretPayment').model;
const PretPrice = keystone.list('PretPrice').model;
const PretTestCode = keystone.list('PretTestCode').model;
const PretNotification = keystone.list('PretNotification').model;
const PretNotificationReadReceipt = keystone.list('PretNotificationReadReceipt').model;

const PretGuestEnquiry = keystone.list('PretGuestEnquiry').model;
// const PretNewsletter = keystone.list('PretNewsletter').model;

/**
* Config
*/
const privateUserFields = [
  'password', 'passwordVersion','isAdmin'
]

const UserTCOptions = {
  fields : {
    remove: ['password', 'passwordVersion','isAdmin']
  },
  resolvers : {
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion'
        ]
      }
    }
  }
};
const PretCandidateTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion','isActivated'
        ]
      }
    }
  }
};
const PretAffiliateTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion','isActivated'
        ]
      }
    }
  }
};
const AdminTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'password', 'passwordVersion'
        ]
      }
    }
  }
};
const InstitutionTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion','createdAt', 'createdBy', 'updatedAt',
       'updatedBy'
    ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'jobs', 'cacRegNo', 'password', 'passwordVersion',
          'isVerified', 'isActive', 'phone', 'isActivated'
        ]
      }
    }
  }
};
const PretPaymentTCOptions = {
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'madeBy', 'paystackReference'
        ]
      }
    }
  }
};
const PretGuestEnquiryTCOptions = {
  resolvers:{
    createOne: {
      record: {
        removeFields: [
          'createdAt', '_id', 'unsubcribeCode', 'isActive'
        ]
      }
    }
  }
};
const NSTCOpts = [ '_id', 'createdAt', 'isActive', 'unsubcribeCode' ]
const PretNewsletterSubscriberTCTCOptions = {
  fields:{
    remove: NSTCOpts
  },
  resolvers:{
    createOne: {
      record: {
        removeFields: NSTCOpts
      }
    }
  }
};

/**
* Exports
*/
const UserTC = exports.UserTC = composeWithMongoose(User, UserTCOptions);
const LocalGovernmentTC = exports.LocalGovernmentTC = composeWithMongoose(LocalGovernment);
const StateTC = exports.StateTC = composeWithMongoose(State);
const PretCandidateTC = exports.PretCandidateTC = composeWithMongoose(PretCandidate, PretCandidateTCOptions);
const PretAffiliateTC = exports.PretAffiliateTC = composeWithMongoose(PretAffiliate, PretAffiliateTCOptions);
const PretCouponTC = exports.PretCouponTC = composeWithMongoose(PretCoupon);
// const AdminTC = exports.AdminTC = composeWithMongoose(Admin, AdminTCOptions);
// const InstitutionTC = exports.InstitutionTC = composeWithMongoose(Institution, InstitutionTCOptions);
// const InstitutionMessageTC = exports.InstitutionMessageTC = composeWithMongoose(InstitutionMessage);
const PretPaymentTC = exports.PretPaymentTC = composeWithMongoose(PretPayment, PretPaymentTCOptions);
const PretPriceTC = exports.PretPriceTC = composeWithMongoose(PretPrice);
const PretTestCodeTC = exports.PretTestCodeTC = composeWithMongoose(PretTestCode);
const PretGuestEnquiryTC = exports.PretGuestEnquiryTC = composeWithMongoose(PretGuestEnquiry, PretGuestEnquiryTCOptions);
const PretNotificationTC = exports.PretNotificationTC = composeWithMongoose(PretNotification);
const PretNotificationReadReceiptTC = exports.PretNotificationReadReceiptTC = composeWithMongoose(PretNotificationReadReceipt);

/**
* Add JWT to user models for login
*/
UserTC.addFields({jwt: 'String', userType: 'String'})
PretCandidateTC.addFields({jwt: 'String'})
// InstitutionTC.addFields({jwt: 'String'})
// AdminTC.addFields({jwt: 'String'})
PretAffiliateTC.addFields({jwt: 'String'})
// PretNotificationTC.addFields({isRead: 'Boolean'})

/**
* Viewer Fields for authentication and authorization
*/
const ViewerPretCandidateTC = exports.ViewerPretCandidateTC = GQC.getOrCreateTC('ViewerPretCandidate');
// const ViewerInstitutionTC = exports.ViewerInstitutionTC = GQC.getOrCreateTC('ViewerInstitution');
// const ViewerAdminTC = exports.ViewerAdminTC = GQC.getOrCreateTC('ViewerAdmin');
const ViewerPretAffiliateTC = exports.ViewerPretAffiliateTC = GQC.getOrCreateTC('ViewerPretAffiliate');

const PretNewsletterSubscriberTC = exports.PretNewsletterSubscriberTC = GQC.getOrCreateTC('PretNewsletterSubscriber');
PretNewsletterSubscriberTC.addFields({address: 'String', subscribed: 'Boolean', name: 'String'})

const PlaceHolderTC = exports.PlaceHolderTC = GQC.getOrCreateTC('PlaceHolder');
