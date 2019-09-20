import Controller from '@ember/controller';
import EmberObject, { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP = {
  BB: 'boroughboardrecommendation',
  BP: 'boroughpresidentrecommendation',
  CB: 'communityboardrecommendation',
};

// all attributes in this class map to their exact match in the Disposition model
class DispositionForAllActions extends EmberObject {
  // the selected recommendation option if applying filled Recommendation
  // to all actions.
  // On submission, this is mapped to the correct Disposition model attribute. ie.
  // communityboardrecommendation, boroughboardrecommendation or boroughpresidentrecommendation
  recommendation = '';

  votinginfavorrecommendation = 0;

  votingagainstrecommendation = 0;

  votingabstainingonrecommendation = 0;

  totalmembersappointedtotheboard = 0;

  votelocation = '';

  dateofvote = '';

  consideration = '';
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

  // `True` if user wishes to apply the same recommendation values to all dispositions.
  // `False` if user wishes to assign different recommendation values to each disposition.
  allActions = undefined;

  dispositionForAllActions = DispositionForAllActions.create();

  // recommendation options for disposition.communityboardrecommendation,
  // disposition.boroughboardrecommendation, disposition.boroughpresidentrecommendation
  recOptions = [
    'Approved',
    'Approved with Modifications/Conditions',
    'Disapproved',
    'Disapproved with Modifications/Conditions',
    'Waived',
  ];

  @action
  setProp(property, newVal) {
    this.set(property, newVal);
  }

  // For setting disposition recommendation, use the action
  // "setDispositionRecByPartType" instead.
  @action
  updateDispositionAttr(disposition, attrName, newVal) {
    disposition.set(attrName, newVal);
  }

  /**
 * @param { Disposition } disposition
 * @param { String } recommendation
 * @param { String } participantType (optional)
 * assigns the `recommendation` string to either the `
 * TODO: Update this to rely on the disposition.participantType field
 * when it is implemented in the ZAP-API.
 */
  @action
  setDispositionRecByPartType (disposition, recommendation) {
    const { participantType } = this;
    const targetField = RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP[participantType];
    if (!targetField) {
      console.log('ZAP Error: Invalid disposition participant type.');
      this.transitionToRoute('oops');
    }
    disposition.set(targetField, recommendation);
  }

  @action
  async onContinue() {
    this.set('modalOpen', true);
  }

  @action
  closeModal() {
    this.set('modalOpen', false);
  }

  /**
   * Saves all dispositions on the loaded project with user-inputted recommendation values.
   * If 'allActions" is `True`, will copy values in dispositionForAllActions into each
   * disposition before saving those dispositions.
   */
  @action
  submitRecommendations() {
    const thisCtrl = this;
    this.dispositions.forEach(function(disposition) {
      if (thisCtrl.allActions) {
        thisCtrl.send('setDispositionRecByPartType', disposition, thisCtrl.dispositionForAllActions.recommendation);
        disposition.setProperties({
          votinginfavorrecommendation: thisCtrl.dispositionForAllActions.votinginfavorrecommendation,
          votingagainstrecommendation: thisCtrl.dispositionForAllActions.votingagainstrecommendation,
          votingabstainingonrecommendation: thisCtrl.dispositionForAllActions.votingabstainingonrecommendation,
          totalmembersappointedtotheboard: thisCtrl.dispositionForAllActions.totalmembersappointedtotheboard,
          consideration: thisCtrl.dispositionForAllActions.consideration,
        });
      }
      disposition.setProperties({
        votelocation: thisCtrl.dispositionForAllActions.votelocation,
        dateofvote: thisCtrl.dispositionForAllActions.dateofvote,
      });
      disposition.save();
    });
    return true;
  }
}
