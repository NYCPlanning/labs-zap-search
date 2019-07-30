import DS from 'ember-data';
import { attr, hasMany } from '@ember-decorators/data';

const { Model } = DS;

export default class UserModel extends Model {
// DB table: dcp_projectlupteam

  // user's internal id should be their email

  // One Project Has Many Users
  @hasMany('project') projects;

  // NOTE: Borough Presidents can have more than one role for a single project--
  // Both a 'Borough President' and 'Borough Board' role.
  // Whenever there is a 'Borough Board' participant listed,
  // reassign that participant type to the Borough President participant,
  // so a BP participant (e.g. BXBP) will show up twice with two different participantTypes (e.g. BB and BP)

  // One User Has Many userProjectParticipation
  @hasMany('userProjectParticipation') userProjectParticipation;

  // Borough President, Borough Board, Community Board 1 - 12
  // a.k.a. Affiliation
  // e.g. BXCB1, BXBB, BXBP, BXCB5
  // calculate this from email e.g. 'bxbp@planning.nyc.gov' or 'qncb5@planning.nyc.gov'
  @attr('string') participantType;

  // sourced from fullname e.g. 'Regis Philbin'
  @attr('string', { defaultValue: '' }) name;

  // sourced from jobtitle e.g. 'district manager'
  @attr('string', { defaultValue: '' }) title;
}
