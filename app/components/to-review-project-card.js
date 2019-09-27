import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  @computed('project')
  get hearingsSubmitted() {
    const dispositions = this.get('project.dispositions');

    // a function to check if each hearing location/date field is truthy
    function infoExists(hearingInfo) {
      return hearingInfo;
    }

    const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
    const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);
    // using function infoExists, fieldsFilled checks whether each item in array is truthy
    const hearingsSubmitted = dispositionHearingLocations.every(infoExists) && dispositionHearingDates.every(infoExists);

    return hearingsSubmitted;
  }

  @computed('hearingsSubmitted', 'project')
  get dedupedHearings() {
    const dispositions = this.get('project.dispositions');

    let deduped;
    const hearingsSubmitted = this.get('hearingsSubmitted');

    if (hearingsSubmitted) {
      deduped = dispositions.reduce((acc, current) => {
        const matchingProps = acc.find(item => item.dcpPublichearinglocation === current.dcpPublichearinglocation && item.dcpDateofpublichearing.toString() === current.dcpDateofpublichearing.toString());

        // if the properties DO match
        if (matchingProps) {
          // just return original object, WITHOUT concatenating the duplicate
          return acc;
        // if the properties DO NOT match
        } return acc.concat([current]);
      }, []);
    }

    return deduped;
  }
}
