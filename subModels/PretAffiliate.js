const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { GENDERS, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * PretAffiliate Model
 * ==========
 */
const PretAffiliate = new keystone.List('PretAffiliate', {
	track: true,
	inherits: keystone.list('User')
});

PretAffiliate.add('PretAffiliate', {
	firstName: { type: Types.Text, required: true, initial: true, index: true },
	lastName: { type: Types.Text, required: true, initial: true, index: true },
	phone: { type: Types.Text, initial: true, unique: true, sparse: true },
	workAddress: { type: Types.Text, initial: true },
	physicalAddress: { type: Types.Text, initial: true },
	// coupon: { type: Types.Relationship, ref: 'PretCoupon', required: false, initial: true},
	referee1: { type: Types.Relationship, ref: 'PretReferee', index: true},
	referee2: { type: Types.Relationship, ref: 'PretReferee', index: true},
	comments: { type: Types.Html, wysiwyg: true, height: 250 },
}, 'Status', {
	isActivated: { type: Boolean, default: false, noedit: true, label: 'email is confirmed' },
	isApproved: { type: Boolean, default: false },
	isActive: { type: Boolean, default: false },
});

//Model Hooks
PretAffiliate.schema.pre('save',async function (next) {
	if (this.firstName) this.firstName = toCamelCase(this.firstName);
	if (this.lastName) this.lastName = toCamelCase(this.lastName);
	this.name = `${this.lastName} ${this.firstName}`
	if (this.isModified("isApproved")) {
		if (this.isApproved) this.sendVerificationConfirmationMail()
	}
	if (this.isModified("isActive")) {
		if (this.isActive) this.sendActiveConfirmationMail()
	}
	next();
})

PretAffiliate.schema.post('save',async function () {
	try {
		if (this.wasNew) {
			this.sendActivationLink();
			this.sendAdminPretNotificationEmail();
		}
	} catch (e) {
		console.log(e);
	}
});

// Methods
// console.log(PretAffiliate.schema.methods);
PretAffiliate.schema.methods.sendActivationLink = function () {
	const user = this;
	return new Promise(function(resolve, reject) {
		console.log("sending user activation email");
		if (user.isActivated) {
			// console.log('Account is already activated');
			reject(new Error('Account is already activated'));
		} else {
			if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
				console.log('Unable to send email - no mailgun credentials provided');
				reject(new Error('could not find mailgun credentials'));
			}

			const brandDetails = keystone.get('brandDetails');

			const code = jwt.sign({
				id: user._id,
				createdAt: Date.now(),
			}, process.env.ACTIVATION_JWT_SECRET);
			const activationLink = `${process.env.FRONT_END_URL}/activate?code=${code}`

			new keystone.Email({
				templateName: 'activate-affiliate-account',
				transport: 'mailgun',
			}).send({
				to: [user.email],
				from: {
					name: 'MCC',
					email: 'no-reply@mycarrerchoice.global',
				},
				subject: 'MCC Account Activation',
				user,
				brandDetails,
				activationLink
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		}
	});
}

PretAffiliate.schema.methods.sendAdminPretNotificationEmail = function () {
	var affiliate = this;

	return new Promise(function(resolve, reject) {
		console.log("sending affiliate notification email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			return callback(new Error('could not find mailgun credentials'));
		}

		var brand = keystone.get('brand');

		keystone.list('keystonePretAdmin').model.find({isAdmin: true, recievePretAffiliatePretNotifications: true}).exec(function (err, admins) {
			if (err) reject(err);
			new keystone.Email({
				templateName: 'affiliate-registration-notification',
				transport: 'mailgun',
			}).send({
				to: admins,
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: 'New Afilliate Registration for MCC',
				affiliate,
				brand,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		});
	})
};

PretAffiliate.schema.methods.sendVerificationConfirmationMail = function () {
	const affiliate = this;
	return new Promise(function(resolve, reject) {
		console.log("sending Verification Confirmation email");
		if (!affiliate.isApproved) {
			// console.log('Account is already activated');
			reject(new Error('Account is not approved'));
		} else {
			if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
				console.log('Unable to send email - no mailgun credentials provided');
				reject(new Error('could not find mailgun credentials'));
			}

			const brandDetails = keystone.get('brandDetails');

			new keystone.Email({
				templateName: 'affiliate-verification-confirmation',
				transport: 'mailgun',
			}).send({
				to: [affiliate.email],
				from: {
					name: 'MCC',
					email: 'no-reply@mycarrerchoice.global',
				},
				subject: 'MCC Affiliate Verification',
				affiliate,
				brandDetails,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		}
	});
}

PretAffiliate.schema.methods.sendActiveConfirmationMail = function () {
	const affiliate = this;
	return new Promise(function(resolve, reject) {
		console.log("sending Activation Confirmation email");
		if (!affiliate.isApproved) {
			// console.log('Account is already activated');
			reject(new Error('Account is not approved'));
		} else {
			if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
				console.log('Unable to send email - no mailgun credentials provided');
				reject(new Error('could not find mailgun credentials'));
			}

			const brandDetails = keystone.get('brandDetails');

			new keystone.Email({
				templateName: 'affiliate-active-confirmation',
				transport: 'mailgun',
			}).send({
				to: [affiliate.email],
				from: {
					name: 'MCC',
					email: 'no-reply@mycarrerchoice.global',
				},
				subject: 'MCC Affiliate Verification',
				affiliate,
				brandDetails,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		}
	});
}


/**
 * Relationships
 */
PretAffiliate.relationship({ ref: 'PretCoupon', path: 'Coupon', refPath: 'affiliate' });
// PretAffiliate.relationship({ ref: 'PretPayment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
PretAffiliate.defaultColumns = 'name, phone, email, isApproved, isActive';
PretAffiliate.register();
