var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PretPayment Model
 * ==========
 */
var PretPayment = new keystone.List('PretPayment', {
    //track: true
});

PretPayment.add({
  // name: { type: Types.Text, required: true, index: true },
  createdAt: { type: Types.Datetime, index: true, default: Date.now(), noedit: true },
  paystackReference: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  madeBy: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
  // testCode: { type: Types.Relationship, ref: 'PretTestCode', required: true, initial: true, index: true },
});

// Model Hooks
PretPayment.schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

PretPayment.schema.post('save', function () {
  if (this.wasNew) {
    // keystone.list('PretTestCode').model.findByIdAndUpdate(this.testCode, {isAssigned: true}).exec();
	}
});

/**
 * Registration
 */
PretPayment.defaultSort = '-createdAt';
PretPayment.defaultColumns = 'createdAt, paystackReference, madeBy';
PretPayment.register();
