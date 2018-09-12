import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';

export default class ShowProjectRoute extends Route {
  model({ id }) {
    return this.store.findRecord('project', id, { reload: true });
  }

  afterModel(...args) {
    const [model] = args;

    model.actions.forEach((cpcAction) => {
      if (cpcAction.statuscode === 'Approved') {
        if (cpcAction.actioncode === 'BD'
              || cpcAction.actioncode === 'HI' // nonulurp
              || cpcAction.actioncode === 'HK'
              || cpcAction.actioncode === 'HN'
              || cpcAction.actioncode === 'NP'
              || cpcAction.actioncode === 'PX'
              || cpcAction.actioncode === 'ZR'
              || cpcAction.actioncode === 'BF' // ulurp
              || cpcAction.actioncode === 'GF'
              || cpcAction.actioncode === 'HA'
              || cpcAction.actioncode === 'HD'
              || cpcAction.actioncode === 'HO'
              || cpcAction.actioncode === 'HP'
              || cpcAction.actioncode === 'HU'
              || cpcAction.actioncode === 'MC'
              || cpcAction.actioncode === 'ML'
              || cpcAction.actioncode === 'MM'
              || cpcAction.actioncode === 'PC'
              || cpcAction.actioncode === 'PE'
              || cpcAction.actioncode === 'PI'
              || cpcAction.actioncode === 'PP'
              || cpcAction.actioncode === 'PQ'
              || cpcAction.actioncode === 'PS'
              || cpcAction.actioncode === 'RS'
              || cpcAction.actioncode === 'SD'
              || cpcAction.actioncode === 'ZM'
              || cpcAction.actioncode === 'ZS') {
          cpcAction.has_cpcReport = true;
        }
      }
    });

    super.afterModel(...args);
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
