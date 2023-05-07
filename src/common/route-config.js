const yaml = require('js-yaml');
const { pathToRegexp } = require('path-to-regexp');
const { Route } = require('./route');
const logger = require('./lambda-logger');

const OPTIONS = {
  strict: false,
  sensitive: false,
  end: true
};

class RouteConfig {
  constructor(basePath, ymlConfig) {
    this.basePath = basePath;
    const config = yaml.load(ymlConfig);

    this.routes = [];
    config.routes.forEach((route) => {
      const regex = pathToRegexp(route.path, [], OPTIONS);
      this.routes.push(new Route(route.id, route.path, route.uri, regex));
    });
  }

  findMatchingRoute(path) {
    let matchedRoute = null;

    let newPath = path;
    if (path && !path.startsWith('/')) {
      newPath = `/${path}`;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const route of this.routes) {
      if (route.regex.test(newPath)) {
        logger.debug(`------------------------ matching route found: ${route}`);
        matchedRoute = route;
        break;
      }
    }

    return matchedRoute;
  }
}

module.exports = { RouteConfig };
