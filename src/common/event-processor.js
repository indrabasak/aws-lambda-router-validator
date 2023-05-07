const _ = require('lodash');
const { RouteConfig } = require('./route-config');
const logger = require('./lambda-logger');
const { RestUtil } = require('./rest-util');

class EventProcessor {
  constructor(basePath, ymlConfig) {
    this.routeConfig = new RouteConfig(basePath, ymlConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  async route(request, response) {
    console.log('33333333333');
    const {
      method,
      pathParameters: { proxy },
      query: params,
      headers,
      body: data
    } = request;

    console.log('44444444444');

    logger.info(`method: ${method}`);
    logger.info(`proxy: ${proxy}`);
    logger.info(`query: ${params}`);
    logger.info(`headers: ${JSON.stringify(headers)}`);
    logger.info(`body: ${JSON.stringify(data)}`);

    console.log('55555555');
    const route = this.routeConfig.findMatchingRoute(proxy);
    if (route) {
      const rawResponse = await RestUtil.request(
        route.uri,
        method,
        proxy,
        params,
        EventProcessor.filterHeaders(headers),
        data
      );
      console.log(`^^^^^^^^^ raw response: ${rawResponse}`);

      EventProcessor.mapResponse(response, rawResponse);
      console.log('6666666666 - 1');
    } else {
      response.status(409);
      console.log('6666666666 - 2');
      response.json({ message: `Route not found for path ${proxy}` });
    }
  }

  static filterHeaders(headers) {
    const newHeaders = { ...headers };
    delete newHeaders.host;

    return newHeaders;
  }

  // static filterHeaders(headers) {
  //   ...(headers.accept && { accept: headers.accept }),
  //   ...(headers.origin && { origin: headers.origin }),
  //   ...(headers['user-agent'] && { 'user-agent': headers['user-agent'] }),
  //   ...(headers['content-type'] && { 'content-type': headers['content-type'] }),
  //   ...(headers['accept-encoding'] && {
  //     'accept-encoding': headers['accept-encoding']
  //   })
  // }

  static mapResponse(response, rawResponse) {
    console.log('^^^^^^^^^ map response');
    const { status, headers, data } = rawResponse;

    if (status) {
      // add status code
      response.status(status);
    }

    if (headers) {
      // add headers
      Object.entries(headers).forEach(([key, value]) => {
        response.header(key, value);
      });
    }

    if (data) {
      if (_.isString(data)) {
        // add body and send
        response.send(data);
      } else if (_.isElement(rawResponse)) {
        response.html(data);
      } else {
        response.json(data);
      }
    }
  }
}

module.exports = { EventProcessor };
