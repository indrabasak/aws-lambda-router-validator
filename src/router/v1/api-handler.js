const fs = require('fs');
const logger = require('../../common/lambda-logger');
const { EventProcessor } = require('../../common/event-processor');

let processor = null;

exports.process = async (request, response) => {
  console.log('22222222222');
  logger.info(`request: ${request}`);
  // logger.info(`response: ${JSON.stringify(response)}`);

  if (processor == null) {
    processor = new EventProcessor(
      process.env.BASE_PATH,
      fs.readFileSync(process.env.ROUTE_CONFIG, 'utf8')
    );
  }

  await processor.route(request, response);
};
