const { PretCandidateTC, PretPaymentTC, PretNotificationTC } = require('../../composers');

module.exports = () => {
  PretCandidateTC.addRelation('payments', {
      resolver: () => PretPaymentTC.getResolver('findMany'),
      prepareArgs: {
        filter: (source) => ({ madeBy: source._id}),
      },
      projection: { madeBy: 1 },
    }
  );
  PretCandidateTC.addRelation('notifications', {
    resolver: () => PretNotificationTC.getResolver('userPretNotifications'),
    prepareArgs: {
      filter: (source) => ({ userId: source._id, userCreatedAt: source.createdAt}),
    },
    projection: { _id: true, createdAt: true },
  });
}
