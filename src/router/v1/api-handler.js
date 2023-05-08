const fs = require('fs');
const { stringify } = require('flatted');
const logger = require('../../common/lambda-logger');
const { EventProcessor } = require('../../common/event-processor');

let processor = null;

exports.process = async (request, response) => {
  console.log('22222222222');
  console.log(stringify(request));

  if (processor == null) {
    processor = new EventProcessor(
      process.env.BASE_PATH,
      fs.readFileSync(process.env.ROUTE_CONFIG, 'utf8'),
      process.env.QUEUE_URL
    );
  }

  await processor.route(request, response);
  console.log('end - ssssssssssssssssssssssss');
};
