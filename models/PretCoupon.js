var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PretCoupon Model
 * ==========
 */
var PretCoupon = new keystone.List('PretCoupon', {
    track: true,
    noedit: true,
    map: {name: 'coupon'}
});

PretCoupon.add({
  coupon: { type: Types.Text, required: true, index: true, initial: true },
  affiliate: { type: Types.Relationship, ref: 'PretAffiliate', required: true, initial: true},
  description: { type: Types.Text, index: true, initial: true },
  isActive: { type: Types.Boolean, index: true, default: true}
});

// PretCoupon.relationship({ ref: 'PretAffiliate', path: 'MCC Affiliates', refPath: 'coupon' });
PretCoupon.relationship({ ref: 'PretCandidate', path: 'candidates', refPath: 'coupon' });

/**
 * Registration
 */
PretCoupon.defaultSort = 'createdAt';
PretCoupon.defaultColumns = 'coupon, description, createdAt';
PretCoupon.register();
