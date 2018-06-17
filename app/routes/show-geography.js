import Route from '@ember/routing/route';

export default class ShowGeographyRoute extends Route {
  queryParams = {
    page: {
      refreshModel: true,
    },
  };

  model({ 'community-district': communityDistrict = '', page = 1 }) {
    let [ cdBoro, cdNumber ] = communityDistrict.split('-');

    cdNumber = ("0" + cdNumber).slice(-2);

    const cdParam = `${cdBoro}${cdNumber}`;

    return this.store.query('project', { 'community-district': cdParam, page: { number: page } });
  }
}
