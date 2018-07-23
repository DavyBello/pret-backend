var keystone = require('keystone');
var Types = keystone.Field.Types;

// const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');
const RECEIVERS_TYPE = [
	'ALL_EXISTING_USERS_AT_CREATION',
	'ALL_EXISTING_USERS_AFTER_CREATION',
	'ALL_PAST_AND_FUTURE_USERS',
	'CUSTOM'
]
/**
 * PretNotification Model
 * ==========
 */
const PretNotification = new keystone.List('PretNotification', {
	track: true
});
PretNotification.schema.set('usePushEach', true);

PretNotification.add({
	message: { type: Types.Text, initial: true, required: true, index: true },
	url: { type: Types.Url, initial: true },
	receiversType: { type: Types.Select, options: RECEIVERS_TYPE, default: 'ALL_EXISTING_USERS_AT_CREATION', index: true },
	receivers: { type: Types.Relationship, ref: 'User', many: true, dependsOn: { receiversType: 'CUSTOM' }, index: true },
});

/**
 * Relationships
 */
PretNotification.relationship({ ref: 'PretNotificationReadReceipt', path: 'readReceipts', refPath: 'notification' });

/**
 * Registration
 */
PretNotification.defaultColumns = 'message, createdAt, receiversType, receivers';
PretNotification.register();
