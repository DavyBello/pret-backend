const keystone = require('keystone');
const { PretCandidateTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const PretCandidate = keystone.list('PretCandidate').model;

module.exports = {
  kind: 'mutation',
  name: 'activateAccount',
  description: 'Activate PretCandidate account',
  args: {code: 'String!'},
  type: PretCandidateTC,
  resolve: async ({ args, context }) => {
    // console.log('candidate activate');
    const { code } = args;
    try {
      const data = jwt.verify(code, process.env.ACTIVATION_JWT_SECRET);
      const { id, createdAt } = data;
      if (id) {
        if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
          const candidate = await PretCandidate.findOne({_id: id});
          if (candidate.isActivated) {
            return Promise.reject('activated account')
          } else {
            candidate.isActivated = true;
            await candidate.save();
            const token = jwt.sign({
              id: candidate.id,
              email: candidate.email,
              type: 'PretCandidate',
              //passwordVersion: candidate.passwordVersion,
            }, process.env.JWT_SECRET);
            candidate.jwt = token;
            context.candidate = Promise.resolve(candidate);
            return candidate;
          }
        } else {
          return Promise.reject('expired token')
        }
      } else {
        return Promise.reject('invalid token')
      }
    } catch (e) {
      throw e;
    }
  }
}
