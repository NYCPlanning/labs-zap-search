import {
  discoverEmberDataModels,
  // applyEmberDataSerializers,
} from 'ember-cli-mirage';
import { createServer } from 'miragejs';
import envConfig from 'labs-zap-search/config/environment';

export default function (config) {
  let finalConfig = {
    ...config,
    // Remove discoverEmberDataModels if you do not want ember-cli-mirage to auto discover the ember models
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models
    },
    // uncomment to opt into ember-cli-mirage to auto discover ember serializers
    // serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  if (envConfig.host) {
    this.passthrough(`${envConfig.host}/**`);
  }

  this.passthrough('https://search-api.planninglabs.nyc/**');
  this.passthrough('https://search-api-production.herokuapp.com/**');
  this.passthrough('https://search-api-staging.herokuapp.com/**');
  this.passthrough('https://planninglabs.carto.com/**');
  this.passthrough('https://raw.githubusercontent.com/**');
  this.passthrough('http://raw.githubusercontent.com/**');
  this.passthrough('https://raw.githubusercontent.com/**');
  this.passthrough('https://tiles.planninglabs.nyc/**');
  this.passthrough('https://layers-api-staging.planninglabs.nyc/**');
  this.passthrough('https://labs-layers-api-staging.herokuapp.com/v1/base/style.json');
  this.passthrough('/test-data/**');
  this.passthrough('https://d3hb14vkzrxvla.cloudfront.net/**');
  this.passthrough('https://rs.fullstory.com/**');
  this.passthrough('https://edge.fullstory.com/**');

  // If the project_lup_status queryParam is set, this endpoint
  // returns CB projects (projects belonging to the first mirage User)
  // within the spcified tab.
  // TODO: If we build mirage functionality to mock logging in as different users,
  // then in this endpoint we should also filter to projects belonging to the specific
  // logged in user.
  // NOTE: This endpoint supports both the project lists in the user dashboard and the projects list
  // on the homepage.
  this.get('/projects', function (schema, request) {
    const { queryParams: { page: offsetParam = 1, project_lup_status } } = request;
    const offset = offsetParam - 1;
    const begin = 0 + (30 * offset);
    const filterByTab = schema.users.all().length > 0 && project_lup_status;
    let json = null;
    let projects = null;

    if (filterByTab) {
      const firstUserId = schema.users.first().id;
      // If querying for projects falling under a specific dashboard tab....
      if (project_lup_status === 'upcoming') {
        projects = schema.projects.where(project => project.tab === 'upcoming' && project.userIds.includes(firstUserId));
      } else if (project_lup_status === 'to-review') {
        projects = schema.projects.where(project => project.tab === 'to-review' && project.userIds.includes(firstUserId));
      } else if (project_lup_status === 'reviewed') {
        projects = schema.projects.where(project => project.tab === 'reviewed' && project.userIds.includes(firstUserId));
      } else if (project_lup_status === 'archive') {
        projects = schema.projects.where(project => project.tab === 'archive' && project.userIds.includes(firstUserId));
      }
    } else {
      // If querying for all projects for the homepage....
      projects = schema.projects.all().slice(begin, begin + 30);
    }

    json = this.serialize(projects);

    json.meta = {
      total: filterByTab ? projects.length : schema.projects.all().length,
      pageTotal: filterByTab ? projects.length : 30,
      tiles: ['http://localhost:4200/test-data/tiles/96.mvt'],
      bounds: [[-73.9916082509177, 40.6824244259472], [-73.8847869770557, 40.8933091086328]],
    };

    return json;
  });

  this.get('/projects/:id', function (schema, request) {
    return schema.projects.find(request.params.id) || schema.projects.find(1);
  });

  this.get('/users', function (schema, request) {
    const { id } = request.params;
    const { me } = request.queryParams;

    if (id) {
      return schema.users.find(id); // users in the second case
    }

    // typically this check requires a cookie in the backend, but as mirage
    // is run in the browser, and we use http-only cookies, we can't simulate
    // this cookie behavior. using regular cookies makes us prone to memory
    // leak issues. http-only cookies means the server is fully responsible
    // for identity management
    if (me) {
      return schema.users.first() || schema.users.create();
    }

    return new Response(401, { some: 'header' }, { errors: ['Unauthorized'] });
  });
  this.get('/users/:id');
  this.get('/zoning-resolutions');

  this.get('/actions');
  this.get('/assignments', function(schema, request) {
    const { queryParams: { tab } } = request;

    return schema.assignments.where({
      tab,
    });
  });
  this.get('/assignments/:id');
  this.get('/actions/:id');

  // TODO: This may need to be updated when the current-user service
  // no longer hardcodes a user
  this.get('/login', function() {
    return {
      ok: true,
    };
  });

  // REST endpoints
  this.patch('/projects/:id');
  this.get('/dispositions');
  this.get('/dispositions/:id');
  this.patch('/dispositions/:id');

  this.post('/document', function(schema, request) {
    // requestBody should be a FormData object
    const { requestBody } = request;
    const success = requestBody.get('instanceId') && requestBody.get('entityName') && requestBody.get('file');
    return success ? new Response(200) : new Response(400, {}, { errors: ['Bad Parameters'] });
  });
}
