import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';

const { Model } = DS;

export default class UserProjectParticipantTypeModel extends Model {
  // ONE Project Has Many User Project Participants
  @belongsTo('project') project;

  // ONE User Has Many User Project Participants
  @belongsTo('user') user;

  // NOTE: Borough Presidents can have more than one participantType
  // Both a 'Borough President' and 'Borough Board' type
  // Whenever there is a 'Borough Board' participant listed (e.g. 'BXBB'),
  // this participant will be reassigned to 'BXBP',
  // so a BP participant (e.g. BXBP) will show up twice with two different participantTypes (e.g. BB and BP)

  // CB (community board), BB (borough board) or BP (borough president)
  // could calculate this based on user.representing
  // could calculate this from email e.g. 'bxbp@planning.nyc.gov' or 'qncb5@planning.nyc.gov'
  @attr('string') participantType;
}
