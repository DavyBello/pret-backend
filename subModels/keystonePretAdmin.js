const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * keystonePretAdmin Model
 * ==========
 */
const keystonePretAdmin = new keystone.List('keystonePretAdmin', {
	track: true,
});

keystonePretAdmin.add({
	name: { type: Types.Text, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	passwordVersion: { type: Types.Text, initial: false, required: true, default: 1},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	recievePretGuestEnquiries: { type: Boolean, label: 'receives notification email when an equiry is made', index: true },
	recievePretAffiliatePretNotifications: { type: Boolean, label: 'receives notification email when an affiliate registers', index: true },
});

// Provide access to Keystone
keystonePretAdmin.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Relationships
 */
// keystonePretAdmin.relationship({ ref: 'PretPayment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
keystonePretAdmin.defaultColumns = 'name, email, isAdmin, recievePretGuestEnquiries, recievePretAffiliatePretNotifications';
keystonePretAdmin.register();
