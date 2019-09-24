import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ToReviewProjectCardComponent extends Component {
  @service
  currentUser;

  @computed('project.actualenddate')
  get timeRemaining() {
    const endDate = this.get('project.actualenddate');
    console.log(endDate);

    return moment(endDate).endOf('day').fromNow('day');
  }

  @computed('project.actualenddate,project.actualstartdate')
  get timeDuration() {
    const endDate = this.get('project.actualenddate');
    const startDate = this.get('project.actualstartdate');

    return moment(endDate) - moment(startDate);
  }

  @computed('project')
  get hearingsSubmitted() {
    const dispositions = this.get('project.dispositions');

    // a function to check if each hearing location/date field is truthy
    function infoExists(hearingInfo) {
      return hearingInfo;
    }

    const dispositionHearingLocations = dispositions.map(disp => `${disp.publichearinglocation}`);
    const dispositionHearingDates = dispositions.map(disp => disp.dateofpublichearing);
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
        const matchingProps = acc.find(item => item.publichearinglocation === current.publichearinglocation && item.dateofpublichearing.toString() === current.dateofpublichearing.toString());

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
