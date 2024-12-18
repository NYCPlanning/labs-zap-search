import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SubscriptionUpdateController extends Controller {
    isSubmitting = false;

    @action
    setIsSubmitting(isSubmittingValue) {
      this.set('isSubmitting', isSubmittingValue);
    }
}
