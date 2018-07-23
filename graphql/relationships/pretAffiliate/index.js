const { PretAffiliateTC, PretCandidateTC, PretCouponTC } = require('../../composers');

module.exports = () => {
  PretAffiliateTC.addRelation('customers', {
      resolver: () => PretCandidateTC.getResolver('pagination'),
      prepareArgs: {
        filter: (source) => ({ coupon: source.coupon}),
      },
      projection: { coupon: 1 },
    }
  );
  PretAffiliateTC.addRelation('coupon', {
      resolver: () => PretCouponTC.getResolver('findOne'),
      prepareArgs: {
        filter: (source) => ({ affiliate: source._id}),
      },
      projection: { affiliate: 1 },
    }
  );
}
