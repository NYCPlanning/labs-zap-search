import { helper } from '@ember/component/helper';

export function centerContent(text) {
  return (text.length && text.offsetWidth > 200) ? 'center-text-tiny' : '';
}

export default helper(centerContent);
