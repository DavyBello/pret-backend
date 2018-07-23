const keystone = require('keystone');
const cors = require('cors');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

const schema = require('../graphql/schema-compose');

const User = keystone.list('User').model;
const PretCandidate = keystone.list('PretCandidate').model;
// const Institution = keystone.list('Institution').model;
// const Admin = keystone.list('Admin').model;
const PretAffiliate = keystone.list('PretAffiliate').model;

// Setup Route Bindings
exports = module.exports = function (app) {
	//Configure CORS -- Remove localhost in final version
	var whitelist = ['http://localhost']
	var corsOptions = {
	  origin: function (origin, callback) {
	    if (whitelist.indexOf(origin) !== -1) {
	      callback(null, true)
	    } else {
	      callback(new Error('Not allowed by CORS'))
	    }
	  }
	}

	//app.use(cors());
	//
	// Register API middleware
	// -------------------------------------------------------------------------
	//NO JWT
	//app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
	//enable cors and jwt middleware on api route
	// app.use('/graphql', cors(corsOptions), bodyParser.json(), jwt({
	app.use('/graphql', cors(), bodyParser.json(), jwt({
	  secret: process.env.JWT_SECRET,
	  credentialsRequired: false,
	}), graphqlExpress(req => {
		//req.user is provided by jwt from the authorization header provided
		let context = {};
		if (req.user) {
			context = {
				//user: req.user ? User.findOne({ _id: req.user._id || req.user.id, version: req.user.version}) : Promise.resolve(null),
				User: req.user.type ? Promise.resolve(req.user) : Promise.resolve(null),
				PretCandidate: req.user.type==='PretCandidate' ?
					PretCandidate.findById(req.user.id) : Promise.resolve(null),
				PretAffiliate: req.user.type==='PretAffiliate' ?
					PretAffiliate.findById(req.user.id) : Promise.resolve(null),
			}
		}
		return ({
		  schema: schema,
		  context: context
		})}
	));

	app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

	// Views
	app.get('/admin', (req, res) => {res.redirect('/keystone')});
	app.get('/', (req, res) => {res.redirect('/keystone')});

	// app.get('/testmail', (req, res) => {
	// 	keystone.list('Ictdata').model.find({"Email":{$ne:null}}).exec(function (err, people) {
	// 		people.forEach(person=>person.sendTestEmail());
	// 		res.json(people.map(person=>person.Email))
	// 		//people.sendTestEmail();
	// 	});
	// });
	// app.get('/testactivation', (req, res) => {
	// 	keystone.list('PretCandidate').model.find({"email":{$ne:null}}).exec(function (err, users) {
	// 		users.forEach(user=>user.sendActivationLink());
	// 		res.json(users.map(user=>user.email))
	// 	});
	// });
	app.get('/testnewsletter', (req, res) => {
		keystone.list('PretNewsletter').model.findOne().exec(function (err, newsletter) {
			const brandDetails = keystone.get('brandDetails');

			new keystone.Email({
				templateName: 'newsletter',
				transport: 'mailgun',
			}).render({
				to: 'subscribers@mycareerchoice.global',
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: newsletter.subject,
				newsletter,
				brandDetails,
			}, (err, { html, text }) => res.send(html));
		});
	});
	app.get('/maillist', (req, res) => {
		const list = mailgun.lists('subscribers@mycareerchoice.global');
		list.members().list(function (err, members) {
		  // `members` is the list of members
		  res.json(members);
		});
	});

	//routes for testing in development
	if (process.env.NODE_ENV == 'development') {
		/*app.all('/test', routes.views.tests.test);
		app.get('/blog/:category?', routes.views.blog);
		app.get('/blog/post/:post', routes.views.post);
		app.get('/gallery', routes.views.gallery);
		app.all('/contact', routes.views.contact);*/
	}

};
