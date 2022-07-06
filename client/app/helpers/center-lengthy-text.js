import { helper } from '@ember/component/helper';

export function centerLengthyText(text) {
  return (text.length > 22) ? 'center-content' : '';
}

export default helper(centerLengthyText);
