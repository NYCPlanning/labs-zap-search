export default function() {
  this.passthrough('https://zola-search-api.planninglabs.nyc/**');
  this.passthrough('https://planninglabs.carto.com/**');
  // These comments are here to help you get started. Feel free to delete them.

  this.get('/projects', function(schema, request) {
    let { queryParams: { page: offsetParam = 1 } } = request;
    let offset = offsetParam - 1;
    let begin = 0 + (10 * offset);

    return schema.projects.all().slice(begin, begin + 10);
  });

  this.get('/projects/:id', function(schema, request) {
    return schema.projects.find(request.params.id) || schema.projects.find(1);
  });

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */
}
