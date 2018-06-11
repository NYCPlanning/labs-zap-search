export default function() {
  this.passthrough('https://zola-search-api.planninglabs.nyc/**');
  this.passthrough('https://planninglabs.carto.com/**');
  // These comments are here to help you get started. Feel free to delete them.

  this.get('/projects');
  this.get('/projects/:id', function(schema, request) {
    return schema.projects.find(request.params.id);
  });

  this.post('/projects');
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
