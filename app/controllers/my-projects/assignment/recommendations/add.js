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
  BB: 'dcpBoroughboardrecommendation',
  BP: 'dcpBoroughpresidentrecommendation',
  CB: 'dcpCommunityboardrecommendation',
};

// all attributes in this class map to their exact match in the Disposition model
class DispositionForAllActions extends EmberObject {
  // the selected recommendation option if applying filled Recommendation
  // to all actions.
  // On submission, this is mapped to the correct Disposition model attribute. ie.
  // dcpCommunityboardrecommendation, dcpBoroughboardrecommendation or dcpBoroughpresidentrecommendation
  recommendation = '';

  dcpVotinginfavorrecommendation = null;

  dcpVotingagainstrecommendation = null;

  dcpVotingabstainingonrecommendation = null;

  dcpTotalmembersappointedtotheboard = null;

  dcpVotelocation = '';

  dcpDateofvote = '';

  dcpConsideration = '';
}

export default class MyProjectsProjectRecommendationsAddController extends Controller {
  @service
  store;

  @service
  currentUser;

  @alias('model.dcpLupteammemberrole')
  participantType;

  // the assignment is available through the model.
  @alias('model')
  assignment;

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
    if (!this.dispositions) {
      return [];
    }
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
      if (!(this.dispositionForAllActionsChangeset.error.dcpVotelocation || this.dispositionForAllActionsChangeset.error.dcpDateofvote)) {
        return true;
      }
    }
    return false;
  }

  // recommendation options for disposition.dcpCommunityboardrecommendation,
  // disposition.dcpBoroughboardrecommendation, disposition.dcpBoroughpresidentrecommendation
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

  @action
  updateDispositionAttr(dedupedObject, dispositions, attrName, newVal) {
    // array of duplicate dispositions
    // this is from the dedupedHearings' duplicateDisps property
    const arrayOfDuplicates = dedupedObject.duplicateDisps;

    arrayOfDuplicates.forEach(function(duplicate) {
      // set the attribute to the new value selected by the user
      // set on the disposition object in the duplicateDisps array
      duplicate.set(attrName, newVal);
      const newAttributeValue = duplicate.get(attrName);

      // find disposition object in model that matches the id of the current duplicate disp
      const matchingDispObject = dispositions.find(item => item.id === duplicate.id);
      // set the disposition model attribute to the updated duplicate disp attribute value
      matchingDispObject.set(attrName, newAttributeValue);
    });
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
  setDispositionChangesetRec (dispositionChangeset, recommendation) {
    const { participantType } = this;
    const targetField = RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP[participantType];

    if (this.allActions) {
      dispositionChangeset.set('recommendation', recommendation);
    } else {
      if (!targetField) {
        console.log('ZAP Error: Invalid disposition participant type.'); // eslint-disable-line
        this.transitionToRoute('oops');
      }
      dispositionChangeset.set(targetField, recommendation);
    }
    if ((recommendation === 'Waived') && (participantType !== 'BP')) {
      dispositionChangeset.validate('dcpVotinginfavorrecommendation');
      dispositionChangeset.validate('dcpVotingagainstrecommendation');
      dispositionChangeset.validate('dcpVotingabstainingonrecommendation');
      dispositionChangeset.validate('dcpTotalmembersappointedtotheboard');
    }
  }

  @action
  onContinue() {
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
   * Saves all dispositions on the loaded assignment with user-inputted recommendation values.
   * If 'allActions" is `True`, will copy values in dispositionForAllActions into each
   * disposition before saving those dispositions.
   */
  @action
  async submitRecommendations() {
    const { participantType } = this;
    const targetField = RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP[participantType];
    this.dispositionForAllActionsChangeset.execute();
    this.dispositionsChangesets.forEach(function(dispositionChangeset) {
      dispositionChangeset.execute();
    });

    this.dispositions.forEach((disposition) => {
      if (this.allActions) {
        disposition.set(targetField, this.dispositionForAllActions.recommendation);
        disposition.setProperties({
          dcpVotinginfavorrecommendation: this.dispositionForAllActions.dcpVotinginfavorrecommendation,
          dcpVotingagainstrecommendation: this.dispositionForAllActions.dcpVotingagainstrecommendation,
          dcpVotingabstainingonrecommendation: this.dispositionForAllActions.dcpVotingabstainingonrecommendation,
          dcpTotalmembersappointedtotheboard: this.dispositionForAllActions.dcpTotalmembersappointedtotheboard,
          dcpConsideration: this.dispositionForAllActions.dcpConsideration,
        });
      }
      disposition.setProperties({
        dcpVotelocation: this.dispositionForAllActions.dcpVotelocation,
        dcpDateofvote: this.dispositionForAllActions.dcpDateofvote,
      });
    });

    try {
      await this.dispositions.save();

      this.dispositionForAllActions.setProperties({
        recommendation: null,
        dcpVotinginfavorrecommendation: null,
        dcpVotingagainstrecommendation: null,
        dcpVotingabstainingonrecommendation: null,
        dcpTotalmembersappointedtotheboard: null,
        dcpVotelocation: null,
        dcpDateofvote: null,
        dcpConsideration: null,
      });
      this.set('modalOpen', false);
      this.transitionToRoute('my-projects.assignment.recommendations.done');
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }
}