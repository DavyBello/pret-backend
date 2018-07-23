const keystone = require('keystone');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { PretCandidateTC } = require('../../composers');
const PretCandidate = keystone.list('PretCandidate').model;

module.exports = () => {
  PretCandidateTC.addResolver({
    kind: 'mutation',
    name: 'loginWithPhone',
    description: 'login a candidate',
    args: {phone: 'String!', password: 'String!'},
    type: PretCandidateTC,
    resolve: async ({ args, context }) => {
      console.log('candidate login this ----');
      const { phone, password } = args;
      //console.log(context);
      return PretCandidate.findOne({phone}).then((candidate) => {
        if (candidate) {
          // validate password
          return bcrypt.compare(password, candidate.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: candidate.id,
                //email: candidate.email,
                phone: candidate.phone,
                type: 'PretCandidate',
                //passwordVersion: candidate.passwordVersion,
              }, process.env.JWT_SECRET);
              candidate.jwt = token;
              context.candidate = Promise.resolve(candidate);
              return candidate;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('phone/candidate not found');
      });
    },
  })

  PretCandidateTC.addResolver({
    kind: 'mutation',
    name: 'signUp',
    description: 'signUp a candidate',
    args: {firstName: 'String!', lastName: 'String!', phone: 'String!', password: 'String!'},
    type: PretCandidateTC,
    resolve: async ({ args, context }) => {
      // console.log('candidate signUp this ----');
      const { firstName, lastName, phone, password } = args;

      return PretCandidate.findOne({phone}).then((existing) => {
        if (!existing) {
          // hash password and create user
          const newPretCandidate = new PretCandidate({
            phone,
            password: password,
            name: {
              first: firstName,
              last: lastName
            }
          })
          return newPretCandidate.save().then((candidate)=>{
            const { id, phone } = candidate;
            const token = jwt.sign({
              id: candidate.id,
              //email: candidate.email,
              phone: candidate.phone,
              type: 'PretCandidate',
              //passwordVersion: candidate.passwordVersion,
            }, process.env.JWT_SECRET);
            // console.log('-----' + candidate.password);
            candidate.jwt = token;
            context.candidate = Promise.resolve(candidate);
            return candidate;
          })
          /*return bcrypt.hash(password, 10).then(hash =>
            PretCandidate.create({
            phone,
            password: hash,
            name: {
              first: firstName,
              last: lastName
            }
          })).then((candidate) => {
            const { id, phone } = candidate;
            console.log('---' + hash);
            const token = jwt.sign({
              id: candidate.id,
              //email: candidate.email,
              phone: candidate.phone,
              type: 'PretCandidate',
              //passwordVersion: candidate.passwordVersion,
            }, process.env.JWT_SECRET);
            console.log('-----' + candidate.password);
            candidate.jwt = token;
            context.candidate = Promise.resolve(candidate);
            return candidate;
          });*/
        }
        return Promise.reject('phone already Exists');
      })
    },
  })
}
