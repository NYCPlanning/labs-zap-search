import DS from 'ember-data';
import { computed } from '@ember/object';

const {
  Model, attr, hasMany,
} = DS;

export default class UserModel extends Model {
  // DB table: dcp_projectlupteam
  // user's internal id should be their email
  @hasMany('assignment', { async: false }) assignments;

  @attr('string', { defaultValue: '' }) landUseParticipant;

  // sourced from fullname e.g. 'Regis Philbin'
  @attr('string', { defaultValue: '' }) name;

  // sourced from jobtitle e.g. 'district manager'
  @attr('string', { defaultValue: '' }) title;

  @attr('string', { defaultValue: '' }) email;

  @attr('string', { defaultValue: '' }) emailaddress1;

  // NOTE: Borough Presidents can have more than one participantType
  // Both a 'Borough President' and 'Borough Board' type
  // Whenever there is a 'Borough Board' participant listed (e.g. 'BXBB'),
  // this participant will be reassigned to 'BXBP',
  // so a BP participant (e.g. BXBP) will show up twice with two different participantTypes (e.g. BB and BP)
  // ONE participant can have multiple Participant Types

  // specific organization that user is a part of, a.k.a affiliation
  // e.g. BXCB1, BXBP, BXCB5
  // could calculate this from email e.g. 'bxbp@planning.nyc.gov' or 'qncb5@planning.nyc.gov'

  // participant computed reassigns borough board participants to borough president e.g. 'BXBB' will be reassigned to 'BXBP'
  @computed('landUseParticipant')
  get participant() {
    const landUseParticipant = this.get('landUseParticipant');
    const lastTwoLetters = /.{2}$/;
    const participantLastTwoLetters = landUseParticipant.match(lastTwoLetters);
    const participantReassigned = participantLastTwoLetters[0] === 'BB' ? landUseParticipant.replace(lastTwoLetters, 'BP') : landUseParticipant;

    return participantReassigned;
  }
}
