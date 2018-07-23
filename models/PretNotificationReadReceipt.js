var keystone = require('keystone');
var Types = keystone.Field.Types;

// const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');
const RECEIVERS_TYPE = [
	'ALL_EXISTING_USERS_AT_CREATION',
	'ALL_EXISTING_USERS_AFTER_CREATION',
	'ALL_PAST AND FUTURE_USERS',
	'CUSTOM'
]
/**
 * PretNotificationReadReceipt Model
 * ==========
 */
const PretNotificationReadReceipt = new keystone.List('PretNotificationReadReceipt', {
	noedit: true
});
PretNotificationReadReceipt.schema.set('usePushEach', true);

PretNotificationReadReceipt.add({
	notification: { type: Types.Relationship, ref: 'PretNotification', many: false, index: true, required: true, initial: true },
	user: { type: Types.Relationship, ref: 'User', many: false, index: true, required: true, initial: true },
	createdAt: { type: Types.Date, index: true, default: Date.now }
});

/**
 * Registration
 */
PretNotificationReadReceipt.defaultColumns = 'message, createdAt, receiversType, receivers';
PretNotificationReadReceipt.register();
