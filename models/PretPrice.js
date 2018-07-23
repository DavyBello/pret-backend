var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PretPrice Model
 * ==========
 */
var PretPrice = new keystone.List('PretPrice', {
    track: true,
    noedit: true
    // map: {name: ''}
});

PretPrice.add({
  pretPrice: { type: Types.Number, required: true, index: true, initial: true },
  description: { type: Types.Text, index: true, initial: true },
});

/**
 * Registration
 */
PretPrice.defaultSort = '-createdAt';
PretPrice.defaultColumns = 'pretPrice, description, createdAt';
PretPrice.register();
