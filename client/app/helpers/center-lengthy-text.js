import { helper } from '@ember/component/helper';

export function centerLengthyText(text) {
  return (text[0].length > 22) ? 'center-content' : '';
}

export default helper(centerLengthyText);
