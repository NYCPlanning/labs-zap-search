import { helper } from '@ember/component/helper';

export function isTextTooLengthy(text) {
  return (text.length && text.length > 22);
}

export default helper(isTextTooLengthy);
