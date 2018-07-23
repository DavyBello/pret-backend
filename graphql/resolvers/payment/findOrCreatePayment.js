const keystone = require('keystone');
const PretPayment = keystone.list('PretPayment').model;
const PretTestCode = keystone.list('PretTestCode').model;
const { PretPaymentTC } = require('../../composers');

if (!process.env.PAYSTACK_SECRET_KEY){
  console.error('PAYSTACK_SECRET_KEY is missing from env');
}
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'findOrCreatePretPayment',
  description: 'find or verifies a payment and assign a test code',
  args: { paystackReference: 'String!' },
  type: PretPaymentTC,
  resolve: async ({ args, context, sourceUser }) => {
    const { paystackReference } = args;
    try {
      const existing = await PretPayment.findOne({paystackReference});
      if (existing) {
        return (existing)
      } else {
        //find code and add to payment
        return new Promise((resolve, reject) => {
          paystack.transaction.verify(paystackReference, async (error, body) => {
            if (error) {
              //possible Error - connect ETIMEDOUT 104.16.6.25:443
              reject(error)
            }
            // console.log(body);
            if (body.status){
              if (body.data.status=="success") {
                //find code and add to payment
                const assignedCode = await PretTestCode.findOne({assignedToPretPayment: paystackReference})
                if (assignedCode) {
                  console.log('assignedCode');
                  const newPretPayment = new PretPayment({
                    paystackReference,
                    madeBy: sourceUser._id
                  })
                  // const payment = await ;
                  resolve(newPretPayment.save());
                } else {
                  // assign payment reference to test code
                  const testCode = await PretTestCode.findOneAndUpdate({assignedToPretPayment: null}, {assignedToPretPayment: paystackReference})
                  if (testCode) {
                    const newPretPayment = new PretPayment({
                      paystackReference,
                      madeBy: sourceUser._id
                    })
                    resolve(newPretPayment.save());
                  } else {
                    reject(new Error('no available code'))
                  }
                }
              } else {
                console.log(body);
                reject(body.data.status)
              }
            } else {
              reject(body.message);
            }
          });
        });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
