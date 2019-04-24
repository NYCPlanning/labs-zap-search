import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import config from 'labs-zap-search/config/environment';

export function getLabelFor([path]) {
  return get(config.labels, path);
}

export default helper(getLabelFor);
