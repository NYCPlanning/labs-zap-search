import DS from 'ember-data';
import ENV from 'labs-zap-search/config/environment';
import { dasherize } from '@ember/string';

const { JSONAPISerializer } = DS;

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(key) { // eslint-disable-line
    return (ENV.environment === 'production' || ENV.environment === 'staging' || ENV.environment === 'devlocal') ? key : dasherize(key);
  }
}
