import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class ShowGeographyRoute extends Route {
  model({ id }) {
    let [ cdBoro, cdNumber ] = id.split('-');

    cdNumber = ("0" + cdNumber).slice(-2);

    const cdParam = `${cdBoro}${cdNumber}`;

    return fetch(`https://zap-api.planninglabs.nyc/projects?community-district=${cdParam}`)
      .then(data => { return data.json(); });
  }
}
