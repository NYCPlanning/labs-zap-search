import { Response } from 'ember-cli-mirage';
import patchXMLHTTPRequest from './helpers/mirage-mapbox-gl-monkeypatch';
import userProjectParticipantTypes from './helpers/user-project-participant-types';

const COMMUNITY_BOARD_REFERRAL_MILESTONE_ID = '923BEEC4-DAD0-E711-8116-1458D04E2FB8';
const BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID = '963BEEC4-DAD0-E711-8116-1458D04E2FB8';
const BOROUGH_BOARD_REFERRAL_MILESTONE_ID = '943BEEC4-DAD0-E711-8116-1458D04E2FB8';

const MILESTONE_ID_LOOKUP = {
  CB: COMMUNITY_BOARD_REFERRAL_MILESTONE_ID,
  BP: BOROUGH_PRESIDENT_REFERRAL_MILESTONE_ID,
  BB: BOROUGH_BOARD_REFERRAL_MILESTONE_ID,
};

const UPCOMING_MILESTONE_STATUSCODE = 'Not Started';
const TO_REVIEW_MILESTONE_STATUSCODE = 'In Progress';
const REVIEWED_MILESTONE_STATUSCODE = 'Completed';

export default function () {
  patchXMLHTTPRequest();

  this.passthrough('https://search-api.planninglabs.nyc/**');
  this.passthrough('https://planninglabs.carto.com/**');
  this.passthrough('https://raw.githubusercontent.com/**');
  this.passthrough('http://raw.githubusercontent.com/**');
  this.passthrough('https://raw.githubusercontent.com/**');
  this.passthrough('https://tiles.planninglabs.nyc/**');
  this.passthrough('https://layers-api-staging.planninglabs.nyc/**');
  this.passthrough('/test-data/**');

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
      return schema.users.first();
    }

    return new Response(401, { some: 'header' }, { errors: ['Unauthorized'] });
  });
  this.get('/users/:id');

  this.get('/actions');
  this.get('/assignments');
  this.get('/actions/:id');

  // TODO: This may need to be updated when the current-user service
  // no longer hardcodes a user
  this.get('/login', function() {
    return {};
  });

  // REST endpoints
  this.patch('/projects/:id');
  this.get('/dispositions');
  this.get('/dispositions/:id');
  this.patch('/dispositions/:id');


  // Mock the project tab endpoints
  // TODO: Update this to match backend endpt when it is finalized
  this.get('/users/:user_id/projects', async function (schema, request) {
    const userId = request.params.user_id;
    const { queryParams: { projectState } } = request;
    let user;

    if (userId) {
      let milestoneStatusCode = null;
      if (projectState === 'upcoming') {
        milestoneStatusCode = UPCOMING_MILESTONE_STATUSCODE;
      }
      if (projectState === 'to-review') {
        milestoneStatusCode = TO_REVIEW_MILESTONE_STATUSCODE;
      }
      if (projectState === 'reviewed') {
        milestoneStatusCode = REVIEWED_MILESTONE_STATUSCODE;
      }

      user = await schema.users.find(userId);
      const userProjects = user.projects.filter((project) => {
        let includeProject = false;
        const userProjPartTypes = userProjectParticipantTypes(user, project);
        for (let i = 0; i < project.milestones.models.length; i += 1) {
          const milestone = project.milestones.models[i];
          if (milestone.statuscode === milestoneStatusCode) {
            for (let j = 0; j < userProjPartTypes.length; j += 1) {
              const userProjPartType = userProjPartTypes[j];
              const partTypeMilestoneId = MILESTONE_ID_LOOKUP[userProjPartType];
              if ((milestone.milestone === partTypeMilestoneId)) {
                includeProject = true;
              }
            }
          }
        }
        return includeProject;
      });
      return userProjects.models.map(projectModel => projectModel.attrs.id);
    }

    return false;
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
