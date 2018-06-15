import Route from '@ember/routing/route';

export default class RouteClass extends Route {
  queryParams = {
    'community-district': {
      refreshModel: true,
    },
  };

  model() {
    return this.store.findAll('project');
  }
}
