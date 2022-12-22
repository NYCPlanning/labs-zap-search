import { helper } from '@ember/component/helper';
import { InvalidError } from '@ember-data/adapter/error';

export function fsSetUserVars(uservars) {
  try {
    // eslint-disable-next-line no-undef
    FS.setUserVars(uservars);
  } catch (e) {
    throw new InvalidError([{ detail: e, message: 'FS.setUserVars failed.' }]);
  }
}

export default helper(fsSetUserVars);
