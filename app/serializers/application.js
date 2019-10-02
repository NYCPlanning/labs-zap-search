import DS from 'ember-data';

export default class ApplicationSerializer extends DS.JSONAPISerializer {
  attrs = { displayDate2: 'display-date-2' };
}
