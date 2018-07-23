const keystone = require('keystone');
const { PretNotificationTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const PretNotification = keystone.list('PretNotification').model;
const PretNotificationReadReceipt = keystone.list('PretNotificationReadReceipt').model;

module.exports = {
  kind: 'query',
  name: 'userPretNotifications',
  description: 'returns all notifications associated with user',
  args: {
    filter: `
      input PretNotificationFilterInput {
        userId: String!
        userCreatedAt: Date!
      }
    `
  },
  type: [PretNotificationTC.addFields({isRead: 'Boolean'})],
  resolve: async ({ args, context }) => {
    const { filter : {userId, userCreatedAt} } = args;
    try {
      const notifications = await PretNotification.find({$or: [
        {
          receiversType: 'ALL_PAST_AND_FUTURE_USERS'
        },
        {
          $and: [ {receiversType: 'ALL_EXISTING_USERS_AT_CREATION'}, {createdAt: {$gte: userCreatedAt}} ]
        },
        {
          $and: [ {receiversType: 'ALL_EXISTING_USERS_AFTER_CREATION'}, {createdAt: {$lte: userCreatedAt}} ]
        },
        {
          $and: [ {receiversType: 'CUSTOM'}, {receivers: {$in: [userId]}} ]
        },
      ]});

      const readReceipts = await PretNotificationReadReceipt.find({
        user: userId
      })

      return notifications.map(notification=>{
        notification.isRead = readReceipts.find(receipt => (receipt.notification == notification.id)) ? true : false;
        return (notification);
      });
    } catch (e) {
      throw e;
    }
  }
}
