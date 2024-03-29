import Controller from '@ember/controller';
import EmberObject, { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
import ENV from 'labs-zap-search/config/environment';
import File from 'ember-file-upload/file';
import {
  bpDispositionForAllActionsValidations,
  cbDispositionForAllActionsValidations,
  bbDispositionForAllActionsValidations,
  communityBoardDispositionValidations,
  boroughBoardDispositionValidations,
  boroughPresidentDispositionValidations,
} from '../../../../validations/recommendation';
import {
  STATUSCODES as DISPO_STATUSCODES,
  STATECODES as DISPO_STATECODES,
} from '../../../../models/disposition/constants';


const MINIMUM_VOTE_DATE = new Date(1990, 1, 1);

const RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP = {
  BB: 'dcpBoroughboardrecommendation',
  BP: 'dcpBoroughpresidentrecommendation',
  CB: 'dcpCommunityboardrecommendation',
};

// TODO: GRAND UNIFYING METADATA OPTION LOOKUP SYSTEM
export const RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP = {
  BB: [
    { code: 717170000, label: 'Favorable' },
    { code: 717170001, label: 'Unfavorable' },
    { code: 717170003, label: 'Conditional Favorable' },
    { code: 717170004, label: 'Conditional Unfavorable' },
    { code: 717170005, label: 'No Objection' },
    { code: 717170002, label: 'Waiver of Recommendation' },
  ],
  BP: [
    { code: 717170000, label: 'Favorable' },
    { code: 717170001, label: 'Conditional Favorable' },
    { code: 717170002, label: 'Unfavorable' },
    { code: 717170003, label: 'Conditional Unfavorable' },
    { code: 717170005, label: 'No Objection' },
    { code: 717170006, label: 'Waiver of Recommendation' },
  ],
  CB: [
    { code: 717170000, label: 'Favorable' },
    { code: 717170001, label: 'Conditional Favorable' },
    { code: 717170002, label: 'Unfavorable' },
    { code: 717170003, label: 'Conditional Unfavorable' },
    { code: 717170007, label: 'No Objection' },
    { code: 717170008, label: 'Waiver of Recommendation' },
  ],
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

  @service
  fileQueue;

  @service
  session;

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

  isSubmitting = false;

  submitError = false;

  errorBody = null;

  @computed('assignment')
  get assignmentQueueName() {
    const parsedAssignmentId = this.assignment.id.replace(/-/g, '');
    return `assign${parsedAssignmentId}`;
  }

  // This is the assignment-specific file queue.
  // It holds all files related to this assignment, across all disposition queues.
  // This queue is also different from the universal queue (global to app).
  // Files are first uploaded to this queue. Then, upon submit, copied over to
  // disposition queues.
  // This queue is also used to list files next to the "upload" button.
  // TODOS:
  //    - Feature to remove files from this queue.
  //    - When implementing "by action" file upload, only copy files from this queue
  //      to dispositions queues if allActions === true.
  @computed('fileQueue', 'assignmentQueueName')
  get assignmentQueue() {
    return this.fileQueue.find(this.assignmentQueueName) || this.fileQueue.create(this.assignmentQueueName);
  }

  // Returns an object with an entry for each disposition and its corresponding file queue.
  // Keys are the disposition id, values are the disposition's file queue.
  // A disposition file queue contains files that will be uploaded to that disposition.
  @computed('fileQueue', 'dispositions')
  get queuesByDisposition() {
    return this.dispositions.reduce((queuesByDisposition, disposition) => {
      queuesByDisposition[disposition.id] = this.fileQueue.find(disposition.id) || this.fileQueue.create(disposition.id);
      return queuesByDisposition;
    }, {});
  }

  @computed('dispositionForAllActions', 'participantType')
  get dispositionForAllActionsChangeset() {
    const { participantType } = this;
    let dispositionForAllActionsValidations = null;
    if (participantType === 'CB') {
      dispositionForAllActionsValidations = cbDispositionForAllActionsValidations;
    }
    if (participantType === 'BB') {
      dispositionForAllActionsValidations = bbDispositionForAllActionsValidations;
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

  @computed('participantType')
  get recOptions() {
    return RECOMMENDATION_OPTIONSET_BY_PARTICIPANT_TYPE_LOOKUP[this.participantType];
  }

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
 * @param { String } recommendation -- string recommendation value. i.e. 'Favorable', 'Unfavorable'...
 * If this.allActions === true, sets the 'recommendation' field
 * for the passed disposition.
 * Otherwise, assigns the `recommendation` argument to the
 * field corresponding to the current participantType.
 * If the value of `recommendation` is 'Waiver of Recommendation', this action executes dispositionChangeset.validate()
 * in order to remove "invalid ui" styles on vote inputs.
 * TODO: Update this to rely on the disposition.participantType field
 * when it is implemented in the ZAP-API.
 */
  @action
  setDispositionChangesetRec (dispositionChangeset, { code: recommendation }) {
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

    // For Borough Board, 717170002 = 'Waiver of Recommendation', For Community Board, 717170008 = 'Waiver of Recommendation'
    const boroughBoardWaiverOfRecommendation = ([717170002].includes(recommendation)) && (participantType === 'BB');
    const communityBoardWaiverOfRecommendation = ([717170008].includes(recommendation)) && (participantType === 'CB');

    // A selection of 'Waiver of Recommendation' makes these four vote & member fields irrelevant
    // Borough Presidents (BP) do not have these vote & member fields at all
    if (boroughBoardWaiverOfRecommendation || communityBoardWaiverOfRecommendation) {
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

  // adds the uploaded file to each disposition queue
  @action
  async addFileToDispositionQueues(file) {
    const copyCompletionStatuses = this.dispositions.map(async (disposition) => {
      // use this private/undocument .blob property to duplicate the file
      const fileCopy = await File.fromBlob(file.blob);
      this.queuesByDisposition[disposition.id].push(fileCopy);
      return true;
    });
    const resolvedStatuses = await Promise.all(copyCompletionStatuses);
    // return after all file copying is complete
    return resolvedStatuses;
  }

  /**
   * Saves all dispositions on the loaded assignment with user-inputted recommendation values.
   * If 'allActions" is `True`, will copy values in dispositionForAllActions into each
   * disposition before saving those dispositions.
   */
  @action
  async submitRecommendations() {
    this.set('isSubmitting', true);
    this.set('submitError', false);

    // array of true/false values each representing whether a disposition
    // had files successfully uploaded to it
    const uploadResults = [];

    try {
      // copy files from assignmentQueue to each disposition queue
      for (let i = 0; i < this.assignmentQueue.files.length; i += 1) {
        await this.addFileToDispositionQueues(this.assignmentQueue.files[i]); // eslint-disable-line
      }

      // upload files across dispositions queues
      for (let i = 0; i < this.dispositions.length; i += 1) {
        const disposition = this.dispositions.objectAt(i);

        const fileUploadPromises = this.queuesByDisposition[disposition.id].files.map(file => file.upload(`${ENV.host}/document`, {
          fileKey: 'file',
          data: {
            instanceId: disposition.id,
            entityName: 'dcp_communityboarddisposition',
          },
          headers: {
            Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
          },
        }));

        // await here because ember-file-upload requires a single file's upload() to complete before the
        // next call of upload() on that file.
        const fileUploadResponses = await Promise.all(fileUploadPromises); // eslint-disable-line

        // The check for matching fileUploadResponse length and assignmentQueueOriginalLength supports acceptance tests
        const filesUploadedToDispo = fileUploadResponses.every(res => res.status === 200);

        uploadResults.push(filesUploadedToDispo);
      }
    } catch (e) {
      this.set('submitError', true);
      this.set('isSubmitting', false);
      console.log(e); // eslint-disable-line
    }

    // Only proceed if all files were uploaded to all dispositions
    // The check for matching uploadResults and dispositions length supports acceptance tests
    if (uploadResults.every(res => res === true) && (uploadResults.length === this.dispositions.length) && !this.submitError) {
      // flush assignment queue after copying is complete
      while (this.assignmentQueue.files.length > 0) {
        this.assignmentQueue.remove(this.assignmentQueue.files[0]);
      }

      const { participantType } = this;
      const targetField = RECOMMENDATION_FIELD_BY_PARTICIPANT_TYPE_LOOKUP[participantType];

      await this.dispositionForAllActionsChangeset.execute();

      this.dispositionsChangesets.forEach(function(dispositionChangeset) {
        dispositionChangeset.execute();
      });

      // we need to manually extract the unvalidated changesets because the full dispositionForAllActions
      // is not validated and therefore won't be applied to individual dispositions in the loop sequence
      const dcpVotelocation = this.dispositionForAllActionsChangeset.get('dcpVotelocation');
      const dcpDateofvote = this.dispositionForAllActionsChangeset.get('dcpDateofvote');

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
          dcpDatereceived: new Date(), // time when user submits recommendation
          dcpVotelocation,
          dcpDateofvote,
          statuscode: DISPO_STATUSCODES.SUBMITTED.label,
          statecode: DISPO_STATECODES.INACTIVE.label,
        });
      });

      try {
        await Promise.all(this.dispositions.map(disposition => disposition.save()));

        // seems like this is a reset operation should the promise resolve
        this.dispositionForAllActions.setProperties({
          recommendation: null,
          dcpVotinginfavorrecommendation: null,
          dcpVotingagainstrecommendation: null,
          dcpVotingabstainingonrecommendation: null,
          dcpTotalmembersappointedtotheboard: null,
          // dcpVotelocation: null,
          // dcpDateofvote: null,
          dcpConsideration: null,
          dcpDatereceived: null,
        });
        this.set('modalOpen', false);
        this.set('submitError', false);
        this.set('isSubmitting', false);
        this.transitionToRoute('my-projects.assignment.recommendations.done');
      } catch (e) {
        this.set('submitError', true);
        this.set('isSubmitting', false);
        console.log(e); // eslint-disable-line
      }
    }
  }
}
