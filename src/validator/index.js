const lambdaLogger = require('../common/lambda-logger');

const logger = lambdaLogger.child({
  executor: 'validator/index'
});

exports.handler = async (event) => {
  logger.info({ Event: event });
};
