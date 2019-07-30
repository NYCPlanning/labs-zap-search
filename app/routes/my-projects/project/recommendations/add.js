import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

function participantTypeLabel(participantType) {
  if (participantType === 'CB') {
    return 'Community Board';
  }
  if (participantType === 'BP') {
    return 'Borough President';
  }
  if (participantType === 'BB') {
    return 'Borough Board';
  }
  return 'Unknown Participant Type';
}

export default class MyProjectsProjectRecommendationsAddRoute extends Route {
  // Depends on the my-project/project route already loading a project
  // with side-loaded actions

  @service
  store;

  @service
  currentUser;

  model() {
    return this.modelFor('my-projects.project');
  }

  async setupController(controller, model) {
    super.setupController(controller, model);

    // ensure valid participantType url query parameter.
    if (!(['BP', 'BB', 'CB'].includes(controller.participantType))) {
      this.transitionTo('my-projects.to-review');
      return;
    }

    // Ensure that participantType url queryParam is within the given project and user's associated
    // participantTypes
    const user = await this.currentUser.get('user');
    const project = model;
    const userPartTypes = user.get('userProjectParticipantTypes').filterBy('project.id', project.get('id')).map(instance => instance.participantType);
    const partTypeLabel = participantTypeLabel(controller.participantType);
    const error = userPartTypes.includes(controller.participantType) ? false : `Sorry, you cannot submit a ${partTypeLabel} Recommendation for this project (${project.dcp_projectname})`;
    controller.set('error', error);

    const participantTypeModelName = `${partTypeLabel.toLowerCase().replace(' ', '-')}-recommendation`;

    controller.set('recommendation', this.store.createRecord(participantTypeModelName, {
      user,
    }));
  }

  @action
  error() {
    this.transitionTo('not-found', 'not-found');
  }
}
