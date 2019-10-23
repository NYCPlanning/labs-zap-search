import Component from '@ember/component';
import { computed } from '@ember/object';

export default class ProjectMilestoneComponent extends Component {
  // @argument
  milestone;

  milestoneParticipantReviewLookup = {
    BP: 'Borough President Review',
    BB: 'Borough Board Review',
    CB: 'Community Board Review',
  }

  // An array of disposition models that match the current milestone
  @computed('milestone', 'milestone.project.dispositions')
  get currentMilestoneDispositions() {
    const currentMilestoneDispositions = [];

    const milestone = this.get('milestone');
    // ALL dispositions associated with a milestone's project
    const dispositions = milestone.get('project.dispositions');
    const milestoneParticipantReviewLookup = this.get('milestoneParticipantReviewLookup');

    // iterate through ALL of the current project's dispositions
    // IF a single disposition's assignment's dcpLupteammemberrole matches the
    // current milestone's displayName, push that disposition into the new
    // currentMilestoneDispositions array
    dispositions.forEach(function(disposition) {
      const participantType = disposition.get('assignment.dcpLupteammemberrole');

      // milestoneParticipantReviewLookup[participantType] = e.g. `Community Board Review`
      if (milestone.displayName === milestoneParticipantReviewLookup[participantType]) {
        currentMilestoneDispositions.push(disposition);
      }
    });

    // if dispositions have been pushed to the array (its length is greater than 1)
    // return arrray -- otherwise return null
    if (currentMilestoneDispositions.length < 1) {
      return null;
    } return currentMilestoneDispositions;
  }

  // An array of disposition models that match the current milestone
  @computed('milestone.milestonename')
  get currentMilestoneUserType() {
    const milestoneName = this.get('milestone.milestonename');
    return milestoneName.replace(' Review', '');
  }


  // if each dcpPublichearinglocation and dcpDateofpublichearing properties are filled in currentMilestoneDispositions array,
  // then hearings have been submitted for that project
  @computed('currentMilestoneDispositions.@each.{dcpPublichearinglocation,dcpDateofpublichearing}')
  get hearingsSubmitted() {
    const dispositions = this.get('currentMilestoneDispositions');
    // array of hearing locations
    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    // array of hearing dates
    const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);
    // hearingsSubmittedForProject checks whether each item in array is truthy
    const arraysFilled = dispositionHearingLocations.length > 0 && dispositionHearingDates.length > 0;
    const hearingsSubmittedForProject = arraysFilled && dispositionHearingLocations.every(location => !!location) && dispositionHearingDates.every(date => !!date);
    return hearingsSubmittedForProject;
  }
}
