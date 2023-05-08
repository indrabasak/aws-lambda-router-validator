const AWS = require('aws-sdk');
const lambdaLogger = require('./lambda-logger');

const logger = lambdaLogger.child({ executor: 'router/index' });

AWS.config.update({ region: process.env.AWS_REGION });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

class QueueUtil {
  static async sendMessage(queueUrl, message) {
    console.log(`&&&&&&&&&&&&&&&&& sendMessage - 1 ${queueUrl}`);
    const sqsMessage = { event: message };

    const params = {
      MessageBody: JSON.stringify(sqsMessage),
      QueueUrl: queueUrl,
      MessageAttributes: null
    };

    console.log('&&&&&&&&&&&&&&&&& sendMessage - 2');
    try {
      console.log('&&&&&&&&&&&&&&&&& sendMessage - 3');
      const data = await SQS.sendMessage(params).promise();
      logger.info('Success sent to SQS', { SQSMessageID: data.MessageId });
      console.log('&&&&&&&&&&&&&&&&& sendMessage - 4');
    } catch (e) {
      logger.error('Error sending to SQS', { Error: e });
      console.log('&&&&&&&&&&&&&&&&& sendMessage - 5');
    }

    console.log('&&&&&&&&&&&&&&&&& sendMessage - 6');
  }
}

module.exports = { QueueUtil };
