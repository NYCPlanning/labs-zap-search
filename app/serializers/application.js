import DS from 'ember-data';
const { JSONAPISerializer } = DS;

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(key) { return key; }
}
