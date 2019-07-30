import DS from 'ember-data';
import { attr, belongsTo } from '@ember-decorators/data';

const { Model } = DS;

export default class UserProjectParticipationModel extends Model {
  // ONE Project Has Many User Project Participants
  @belongsTo('project') project;

  // ONE User Has Many User Project Participants
  @belongsTo('user') user;

  // CB, BB or BP.
  // could calculate this based on user.representing
  // sourced from dcp_lupteammemberrole in dcp_projectlupteam
  @attr() participationType;
}
