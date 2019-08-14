import Route from '@ember/routing/route';

export default class MyProjectsProjectHearingAddRoute extends Route {
  resetController(controller, isExiting) {
    // reset all of these parameters when exiting the controller
    // otherwise they cache and will affect the defaults of other projects
    if (isExiting) {
      controller.set('location', '');
      controller.set('date', null);
      controller.set('time', null);
      controller.set('additionalLocationInfo');
      controller.set('timeMissing', null);
      controller.set('locationMissing', null);
      controller.set('dateMissing', null);
    }
  }
}
