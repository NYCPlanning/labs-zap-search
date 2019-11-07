import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { validate } from 'ember-validators';

/**
  * Validator takes one object with the following properties:
 * @param { bool } presence
 * @param { String } unless
 * @param { Any } value (optional)
 * validates a field for presence unless a the `unless` target field has specified `value`
 */
export default function validatePresenceUnlessValue(options) {
  let target;
  let targetValue;

  if (options && options.unless !== undefined && options.value !== undefined) {
    if (typeof options.unless === 'string') {
      target = options.unless;
    }
    if (options.value || options.value === 0) {
      targetValue = options.value;
    }

    delete options.unless;
    delete options.value;
  }

  return (key, value, _oldValue, changes, content) => {
    if (target && (changes[target] || (changes[target] === undefined && content[target]))) {
      if ((changes[target] === targetValue) || (changes[target] === undefined && (content[target] === targetValue))) {
        return true;
      }
    }

    const result = validate('presence', value, options, null, key);

    if (typeof result === 'boolean' || typeof result === 'string') {
      return result;
    }
    // We flipped the meaning behind `present` and `blank` so switch the two
    if (result.type === 'present') {
      result.type = 'blank';
    } else if (result.type === 'blank') {
      result.type = 'present';
    }

    return buildMessage(key, result);
  };
}
