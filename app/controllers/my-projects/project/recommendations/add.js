import Controller from '@ember/controller';
import EmberObject, { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

class RecommendationOption extends EmberObject {
  label = '';

  code = '';

  actions = A();
}

export default class MyProjectsProjectRecommendationsAddController extends Controller {
  queryParams = ['participantType'];

  @service
  store;

  @service
  currentUser;

  // the project is available through the model.
  @alias('model')
  project;

  // the participant-type-dependent Recommendation is set up within the router's
  // setupController.

  // if the new recommendation applies to all actions
  allActions = true;

  // the selected recommendation option if applying filled Recommendation
  // to all actions
  allActionsRecommendation = '';

  recommendationOptions = EmberObject.create({
    approved: RecommendationOption.create({
      label: 'Approved',
      code: 'approved',
    }),
    'approved-with-modifications-conditions': RecommendationOption.create({
      label: 'Approved with Modifications/Conditions',
      code: 'approved-with-modifications-conditions',
    }),
    disapproved: RecommendationOption.create({
      label: 'Disapproved',
      code: 'disapproved',
    }),
    'disapproved-with-modifications-conditions': RecommendationOption.create({
      label: 'Disapproved with Modifications/Conditions',
      code: 'disapproved-with-modifications-conditions',
    }),
    'not-available': RecommendationOption.create({
      label: 'N/A',
      code: 'not-available',
    }),
  });

  @computed('recommendationOptions.{approved.actions.[],["approved-with-modifications-conditions"].actions.[],disapproved.actions.[],["disapproved-with-modifications-conditions"].actions.[],["not-available"].actions.[]}')
  get allOptionsActions() {
    const allActions = [
      ...this.recommendationOptions.approved.actions,
      ...this.recommendationOptions.get('approved-with-modifications-conditions').actions,
      ...this.recommendationOptions.disapproved.actions,
      ...this.recommendationOptions.get('disapproved-with-modifications-conditions').actions,
      ...this.recommendationOptions.get('not-available').actions,
    ];
    return allActions;
  }

  @action
  setProp(property, newVal) {
    this.set(property, newVal);
  }

  @action
  updateDispositionAttr(disposition, attrName, newVal) {
    disposition.set(attrName, newVal);
  }
}
