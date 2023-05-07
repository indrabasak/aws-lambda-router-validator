const { RouteConfig } = require('./route-config');
const logger = require('./lambda-logger');

class EventProcessor {
  constructor(basePath, ymlConfig) {
    this.routeConfig = new RouteConfig(basePath, ymlConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  async route(request, response) {
    console.log('33333333333');
    // const {
    //   method,
    //   pathParameters: { proxy },
    //   query: params,
    //   headers,
    //   body: data
    // } = request;
    //
    // console.log('44444444444');
    //
    // logger.info(`method: ${method}`);
    // logger.info(`pathParameters: ${proxy}`);
    // logger.info(`query: ${params}`);
    // logger.info(`headers: ${headers}`);
    // logger.info(`body: ${JSON.stringify(data)}`);

    console.log('55555555');

    response.status(200);
    console.log('6666666666');
    response.json({ message: 'Hello - just a test!' });
  }
}

module.exports = { EventProcessor };
