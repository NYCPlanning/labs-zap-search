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

  this.get('/projects', function (schema, request) {
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

  this.get('/projects/:id', function (schema, request) {
    return schema.projects.find(request.params.id) || schema.projects.find(1);
  });

  this.get('/users', function (schema, request) {
    const { id } = request.params;
    const { me } = request.queryParams;

    // check that this is a request for an auth'd user and there's a cookie
    if (me && document.cookie.includes('token')) return schema.users.first();

    return schema.users.find(id); // users in the second case
  });
  this.get('/users/:id');

  this.get('/actions');
  this.get('/actions/:id');

  this.get('/recommendations', function (schema) {
    const recommendations = schema.communityBoardRecommendations.all();
    recommendations.push(schema.boroughBoardRecommendations.all());
    recommendations.push(schema.boroughPresidentRecommendations.all());
    recommendations.modelName = 'recommendation';
    return recommendations;
  });

  this.get('/borough-president-recommendations');
  this.get('/community-board-recommendations');
  this.get('/borough-board-recommendations');

  this.post('/borough-president-recommendations');
  this.post('/community-board-recommendations');
  this.post('/borough-board-recommendations');

  this.get('/login', function () {
    document.cookie = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250YWN0SWQiOiIyYTIzMWQxNC02OTNlLWU4MTEtODEzMy0xNDU4ZDA0ZDA2YzAiLCJpYXQiOjExMTExMTExMX0.1G_sYrMbZ1EWoZxz75sTUejv-hjqyHLjq7OM253RHes;';

    return {};
  });

  // REST endpoints
  this.get('/hearings');
  this.get('/hearings/:id');
  this.patch('/hearings/:id');
  this.post('/hearings');


  // Mock the project tab endpoints
  // TODO: Update this to match backend endpt when it is finalized
  this.get('/users/:user_id/projects', async function (schema, request) {
    const userId = request.params.user_id;
    const { queryParams: { projectState } } = request;
    let user;

    if (document.cookie.includes('token')) {
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
          if (milestone.statusCode === milestoneStatusCode) {
            for (let j = 0; j < userProjPartTypes.length; j += 1) {
              const userProjPartType = userProjPartTypes[j];
              const partTypeMilestoneId = MILESTONE_ID_LOOKUP[userProjPartType];
              if ((milestone.milestoneId === partTypeMilestoneId)) {
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
