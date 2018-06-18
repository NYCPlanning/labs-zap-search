import { helper } from '@ember/component/helper';

function pad(string, size) {
  while (string.length < (size || 2)) {string = "0" + string;}
  return string;
}

export function buildZrUrl([zr]) {
  // get everything before the hyphen
  const articleChapter = zr.split('-')[0];

  // to get article, drop the last character
  const article = pad(articleChapter.slice(0, - 1), 2);
  // to get chapter, get the last character
  const chapter = pad(articleChapter.substr(-1), 2);

  // TODO handle values that don't match this hyphenated format (AppendixD, AppendixF, E37-04f1, E37-04g6)

  return `https://www1.nyc.gov/assets/planning/download/pdf/zoning/zoning-text/art${article}c${chapter}.pdf`;
}

export default helper(buildZrUrl);
