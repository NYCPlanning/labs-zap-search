import { helper } from '@ember/component/helper';

export function isTextTooLengthy(text) {
  return (text.length && text.length > 22) ? 'center-text-tiny' : '';
}

export default helper(isTextTooLengthy);
