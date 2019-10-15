import DS from 'ember-data';

export default class MilestoneSerializer extends DS.JSONAPISerializer {
  attrs = { displayDate2: 'display-date-2' };
}
