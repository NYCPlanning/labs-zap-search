import Controller from '@ember/controller';
import EmberObject, { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
import {
  bpDispositionForAllActionsValidations,
  cbBbDispositionForAllActionsValidations,
  communityBoardDispositionValidations,
  boroughBoardDispositionValidations,
  boroughPresidentDispositionValidations,
} from '../../../../validations/recommendation';

const MINIMUM_VOTE_DATE = new Date(1990, 1, 1);

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

  votinginfavorrecommendation = null;

  votingagainstrecommendation = null;

  votingabstainingonrecommendation = null;

  totalmembersappointedtotheboard = null;

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

  minDate = MINIMUM_VOTE_DATE;

  @computed('dispositionForAllActions', 'participantType')
  get dispositionForAllActionsChangeset() {
    const { participantType } = this;
    let dispositionForAllActionsValidations = null;
    if (participantType === 'CB') {
      dispositionForAllActionsValidations = cbBbDispositionForAllActionsValidations;
    }
    if (participantType === 'BB') {
      dispositionForAllActionsValidations = cbBbDispositionForAllActionsValidations;
    }
    if (participantType === 'BP') {
      dispositionForAllActionsValidations = bpDispositionForAllActionsValidations;
    }
    return new Changeset(this.dispositionForAllActions, lookupValidator(dispositionForAllActionsValidations), dispositionForAllActionsValidations);
  }

  // this.dispositionsChangesets[i] is the changeset for this.dispositions[i]
  @computed('dispositions', 'participantType')
  get dispositionsChangesets() {
    const { participantType } = this;
    let dispositionValidations = null;
    if (participantType === 'CB') {
      dispositionValidations = communityBoardDispositionValidations;
    }
    if (participantType === 'BB') {
      dispositionValidations = boroughBoardDispositionValidations;
    }
    if (participantType === 'BP') {
      dispositionValidations = boroughPresidentDispositionValidations;
    }
    return this.dispositions.map(disposition => new Changeset(disposition, lookupValidator(dispositionValidations), dispositionValidations));
  }

  @computed('dispositions', 'dispositionsChangesets')
  get dispositionAndChangesetPairs() {
    const dispositionAndChangesetPairs = [];
    for (let i = 0; i < this.dispositions.length; i += 1) {
      dispositionAndChangesetPairs.push({
        disposition: this.dispositions.objectAt(i),
        changeset: this.dispositionsChangesets.objectAt(i),
      });
    }
    return dispositionAndChangesetPairs;
  }

  @computed('dispositionsChangesets.@each.isValid')
  get isDispositionsChangesetsValid() {
    let isValid = true;
    this.dispositionsChangesets.forEach((dispositionChangeset) => {
      if (!dispositionChangeset.isValid) {
        isValid = false;
      }
    });
    return isValid;
  }

  @computed('allActions', 'dispositionForAllActionsChangeset.isValid', 'isDispositionsChangesetsValid')
  get isFormValid() {
    if (this.allActions) {
      if (this.dispositionForAllActionsChangeset.isValid) {
        return true;
      }
      return false;
    }
    if (this.isDispositionsChangesetsValid) {
      if (!(this.dispositionForAllActionsChangeset.error.votelocation || this.dispositionForAllActionsChangeset.error.dateofvote)) {
        return true;
      }
    }
    return false;
  }

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
 * @param { Changeset } dispositionChangeset
 * @param { String } recommendation -- string recommendation value. i.e. 'Approved', 'Disapproved w/ Modifications'...
 * If this.allActions === true, sets the 'recommendation' field
 * for the passed disposition.
 * Otherwise, assigns the `recommendation` argument to the
 * field corresponding to the current participantType.
 * If the value of `recommendation` is 'Waived', this action executes dispositionChangeset.validate()
 * in order to remove "invalid ui" styles on vote inputs.
 * TODO: Update this to rely on the disposition.participantType field
 * when it is implemented in the ZAP-API.
 */
  @action
  setDispositionRec (dispositionChangeset, recommendation) {
    const { participantType } = this;
    const targetField = RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP[participantType];

    if (this.allActions) {
      dispositionChangeset.set('recommendation', recommendation);
    } else {
      if (!targetField) {
        console.log('ZAP Error: Invalid disposition participant type.');
        this.transitionToRoute('oops');
      }
      dispositionChangeset.set(targetField, recommendation);
    }
    if ((recommendation === 'Waived') && (participantType !== 'BP')) {
      dispositionChangeset.validate('votinginfavorrecommendation');
      dispositionChangeset.validate('votingagainstrecommendation');
      dispositionChangeset.validate('votingabstainingonrecommendation');
      dispositionChangeset.validate('totalmembersappointedtotheboard');
    }
  }

  @action
  async onContinue() {
    this.dispositionForAllActionsChangeset.validate();
    this.dispositionsChangesets.forEach(changeset => changeset.validate());
    if (this.isFormValid) {
      this.set('modalOpen', true);
    }
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
    this.dispositionForAllActionsChangeset.execute();
    this.dispositionsChangesets.forEach(function(dispositionChangeset) {
      dispositionChangeset.execute();
    });
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
    this.dispositionForAllActions.setProperties({
      recommendation: null,
      votinginfavorrecommendation: null,
      votingagainstrecommendation: null,
      votingabstainingonrecommendation: null,
      totalmembersappointedtotheboard: null,
      votelocation: null,
      dateofvote: null,
      consideration: null,
    });
    this.set('modalOpen', false);
    this.transitionToRoute('my-projects.project.recommendations.done');
    return true;
  }
}
