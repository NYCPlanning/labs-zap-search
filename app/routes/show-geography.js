import Route from '@ember/routing/route';
import formatCdParam from '../utils/format-cd-param';

export default class ShowGeographyRoute extends Route {
  queryParams = {
    page: {
      refreshModel: true,
    },
    dcp_publicstatus: {
      refreshModel: true,
    },
  };

  async model(params) {
    const {
      'community-district': communityDistrict = '', 
      dcp_publicstatus,
      page = 1,
    } = params;

    const cdParam = formatCdParam(communityDistrict)

    await this.store.query('project', { 
      'community-district': cdParam, 
      dcp_publicstatus,
      page,
    });

    return this.store.peekAll('project');
  }
}
