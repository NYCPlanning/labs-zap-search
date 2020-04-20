import { helper } from '@ember/component/helper';

function shortenProjectBrief([projectbrief]) {
  if (projectbrief != null && projectbrief.length > 120) {
    const shortenedString = `${projectbrief.substring(0, 120)}...`;
    return shortenedString;
  }

  return projectbrief;
}

export default helper(shortenProjectBrief);
