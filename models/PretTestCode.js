var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PretTestCode Model
 * ==========
 */
var PretTestCode = new keystone.List('PretTestCode', {
  map: { name: 'code' }
});

PretTestCode.add({
  code: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  isExpired: { type: Boolean, index: true, default: false },
  createdAt: { type: Types.Datetime, index: true, default: Date.now(), noedit: true },
  // paystackReference
  assignedToPretPayment: { type: Types.Text, index: true, noedit: true, unique: true, sparse: true },
});

// PretTestCode.relationship({ ref: 'PretPayment', path: 'payment', refPath: 'testCode' });

/**
 * Registration
 */
PretTestCode.defaultSort = '-createdAt';
PretTestCode.defaultColumns = 'code, assignedToPretPayment, createdAt, isExpired';
PretTestCode.register();
