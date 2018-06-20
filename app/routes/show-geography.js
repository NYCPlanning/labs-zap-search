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
    dcp_femafloodzonea: {
      refreshModel: true,
    },
    dcp_femafloodzonecoastala: {
      refreshModel: true,
    },
    dcp_femafloodzoneshadedx: {
      refreshModel: true,
    },
    dcp_femafloodzonev: {
      refreshModel: true,
    },
  };

  async model(params) {
    const {
      'community-districts': communityDistricts = [],
      dcp_publicstatus,
      dcp_ceqrtype,
      dcp_ulurp_nonulurp,
      dcp_femafloodzonea,
      dcp_femafloodzonecoastala,
      dcp_femafloodzoneshadedx,
      dcp_femafloodzonev,
      page = 1,

    } = params;

    const queryOptions = {
      'community-districts': communityDistricts,
      dcp_publicstatus,
      dcp_ceqrtype,
      dcp_ulurp_nonulurp,
      page,
    }

    // special handling for FEMA flood zones
    // only add to the api call if set to true
    if (dcp_femafloodzonea) queryOptions.dcp_femafloodzonea = true;
    if (dcp_femafloodzonecoastala) queryOptions.dcp_femafloodzonecoastala = true;
    if (dcp_femafloodzoneshadedx) queryOptions.dcp_femafloodzoneshadedx = true;
    if (dcp_femafloodzonev) queryOptions.dcp_femafloodzonev = true;

    const projects = await this.store.query('project', queryOptions);

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
