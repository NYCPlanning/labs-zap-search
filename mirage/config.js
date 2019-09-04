import patchXMLHTTPRequest from './helpers/mirage-mapbox-gl-monkeypatch';

export default function() {
  patchXMLHTTPRequest();

  this.passthrough('https://search-api.planninglabs.nyc/**');
  this.passthrough('https://planninglabs.carto.com/**');
  this.passthrough('https://raw.githubusercontent.com/**');
  this.passthrough('http://raw.githubusercontent.com/**');
  this.passthrough('https://raw.githubusercontent.com/**');
  this.passthrough('https://tiles.planninglabs.nyc/**');
  this.passthrough('https://layers-api-staging.planninglabs.nyc/**');
  this.passthrough('/test-data/**');

  this.get('/projects', function(schema, request) {
    const { queryParams: { page: offsetParam = 1 } } = request;
    const offset = offsetParam - 1;
    const begin = 0 + (30 * offset);

    const json = this.serialize(
      schema.projects.all().slice(begin, begin + 30),
    );

    json.meta = {
      total: schema.projects.all().length,
      pageTotal: 30,
      tiles: ['http://localhost:4200/test-data/tiles/96.mvt'],
      bounds: [[-73.9916082509177, 40.6824244259472], [-73.8847869770557, 40.8933091086328]],
    };

    return json;
  });

  this.get('/projects/:id', function(schema, request) {
    return schema.projects.find(request.params.id) || schema.projects.find(1);
  });

  this.get('/users', function(schema, request) {
    const { id } = request.params;
    const { me } = request.queryParams;

    // check that this is a request for an auth'd user and there's a cookie
    if (me && document.cookie.includes('token')) return schema.users.first();

    return schema.users.find(id); // users in the second case
  });
  this.get('/users/:id');

  this.get('/actions');
  this.get('/actions/:id');

  this.get('/recommendations', function(schema) {
    const cbRecs = schema.communityBoardRecommendations.all();
    const bbRecs = schema.boroughBoardRecommendations.all();
    const bpRecs = schema.boroughPresidentRecommendations.all();
    return {
      data: [...cbRecs.models, ...bbRecs.models, ...bpRecs.models],
    };
  });

  this.get('/borough-president-recommendations');
  this.get('/community-board-recommendations');
  this.get('/borough-board-recommendations');

  this.post('/borough-president-recommendations');
  this.post('/community-board-recommendations');
  this.post('/borough-board-recommendations');

  this.get('/login', function() {
    document.cookie = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0SWQiOiIyYTIzMWQxNC02OTNlLWU4MTEtODEzMy0xNDU4ZDA0ZDA2YzAiLCJpYXQiOjExMTExMTExMX0.1G_sYrMbZ1EWoZxz75sTUejv-hjqyHLjq7OM253RHes;';

    return {};
  });

  // REST endpoints
  this.patch('/projects/:id');
  this.get('/hearings');
  this.get('/hearings/:id');
  this.patch('/hearings/:id');
  this.post('/hearings');

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
