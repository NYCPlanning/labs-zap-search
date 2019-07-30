import DS from 'ember-data';
import { attr, hasMany } from '@ember-decorators/data';

const { Model } = DS;

export default class UserModel extends Model {
// DB table: dcp_projectlupteam

  // user's internal id should be their email

  // Many Projects to Many Users
  @hasMany('project') projects;

  // ONE User Has Many User Project Participants
  @hasMany('userProjectParticipantTypes') userProjectParticipantTypes;

  // NOTE: Borough Presidents can have more than one participantType
  // Both a 'Borough President' and 'Borough Board' type
  // Whenever there is a 'Borough Board' participant listed (e.g. 'BXBB'),
  // this participant will be reassigned to 'BXBP',
  // so a BP participant (e.g. BXBP) will show up twice with two different participantTypes (e.g. BB and BP)
  // ONE participant can have multiple Participant Types

  // specific organization that user is a part of, a.k.a affiliation
  // e.g. BXCB1, BXBP, BXCB5
  // could calculate this from email e.g. 'bxbp@planning.nyc.gov' or 'qncb5@planning.nyc.gov'
  @attr('string') participant;

  // One User Has Many userProjectParticipation
  @hasMany('userProjectParticipation') userProjectParticipation;

  // sourced from fullname e.g. 'Regis Philbin'
  @attr('string', { defaultValue: '' }) name;

  // sourced from jobtitle e.g. 'district manager'
  @attr('string', { defaultValue: '' }) title;
}
