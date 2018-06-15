import Route from '@ember/routing/route';
import fetch from 'fetch';
import environment from '../config/environment';

export default class ShowGeographyRoute extends Route {
  model({ 'community-district': communityDistrict = '' }) {
    const { host = '' } = environment;
    let [ cdBoro, cdNumber ] = communityDistrict.split('-');

    cdNumber = ("0" + cdNumber).slice(-2);

    const cdParam = `${cdBoro}${cdNumber}`;

    // return fetch(`${host}/projects?community-district=${cdParam}`)
    //   .then(data => { return data.json(); });
    return this.store.findAll('project', { 'community-district': cdParam });
  }
}
