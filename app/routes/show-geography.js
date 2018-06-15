import Route from '@ember/routing/route';

export default class ShowGeographyRoute extends Route {
  model({ 'community-district': communityDistrict = '' }) {
    let [ cdBoro, cdNumber ] = communityDistrict.split('-');

    cdNumber = ("0" + cdNumber).slice(-2);

    const cdParam = `${cdBoro}${cdNumber}`;

    return this.store.findAll('project', { 'community-district': cdParam });
  }
}
