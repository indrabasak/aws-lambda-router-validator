class Route {
  constructor(id, path, uri, regex) {
    this.id = id;
    this.path = path;
    this.uri = uri;
    this.regex = regex;
  }
}

module.exports = { Route };
