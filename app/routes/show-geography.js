import Route from '@ember/routing/route';

export default class ShowGeographyRoute extends Route {
  queryParams = {
    page: {
      refreshModel: true,
    },
    dcp_publicstatus: {
      refreshModel: true,
    },
    dcp_ceqrtype: {
      refreshModel: true,
    },
    dcp_ulurp_nonulurp: {
      refreshModel: true,
    },
    'community-districts': {
      refreshModel: true,
    },
  };

  async model(params) {
    const {
      'community-districts': communityDistricts = [], 
      dcp_publicstatus,
      dcp_ceqrtype,
      dcp_ulurp_nonulurp,
      page = 1,
    } = params;

    const projects = await this.store.query('project', { 
      'community-districts': communityDistricts, 
      dcp_publicstatus,
      dcp_ceqrtype,
      dcp_ulurp_nonulurp,
      page,
    });

    const meta = projects.get('meta');

    return {
      projects: this.store.peekAll('project'),
      meta,
    };
  }

  setupController(controller, { projects: model, meta }) {
    controller.set('meta', meta);

    super.setupController(controller, model);
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('page', 1);
    }
  }
}
