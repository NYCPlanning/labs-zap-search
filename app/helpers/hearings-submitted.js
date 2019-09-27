import { helper } from '@ember/component/helper';

export function hearingsSubmitted(dispositions) {
  // array of hearing locations
  const dispositionHearingLocations = dispositions.map(disp => `${disp.dcpPublichearinglocation}`);
  // array of hearing dates
  const dispositionHearingDates = dispositions.map(disp => disp.dcpDateofpublichearing);

  // hearingsSubmittedForProject checks whether each item in array is truthy
  const hearingsSubmittedForProject = dispositionHearingLocations.every(location => !!location) && dispositionHearingDates.every(date => !!date);

  return hearingsSubmittedForProject;
}

export default helper(hearingsSubmitted);
