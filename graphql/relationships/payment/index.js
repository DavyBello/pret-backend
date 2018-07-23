const { PretPaymentTC, PretTestCodeTC } = require('../../composers');

module.exports = () => {
  PretPaymentTC.addRelation('testCode', {
      resolver: () => PretTestCodeTC.getResolver('findOne'),
      prepareArgs: {
        filter: (source) => ({ assignedToPretPayment: source.paystackReference}),
      },
      projection: { assignedToPretPayment: true },
    }
  );
}
