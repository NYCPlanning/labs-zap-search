import $ from 'jquery';
import Component from '@glimmer/component';
import { action, computed, set } from '@ember/object';
import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';
import { getCommunityDistrictsByBorough } from '../helpers/lookup-community-district';
import { validateEmail } from '../helpers/validate-email';

export default class SubscriptionFormComponent extends Component {
    communityDistrictsByBorough = {};

    isCommunityDistrict = false;

    isSubmitting = false;

    showSubscriptionUpdateConfirmationModal = false;

    updateStatus = 'none';

    previousSubscriptions = {};

    previousIsCommunityDistrict = false;

    constructor(...args) {
      super(...args);

      this.communityDistrictsByBorough = getCommunityDistrictsByBorough();

      // Extra steps to take for updates
      if (this.args.isUpdate) {
        // Determine value of CD checkbox
        if (this.isAtLeastOneCommunityDistrictSelected) {
          this.isCommunityDistrict = true;
          this.previousIsCommunityDistrict = true;
        }
        // Copy subscriptions to compare for changes
        this.previousSubscriptions = { ...this.args.subscriptions };
      }
    }

    @computed('args.subscriptions.CW')
    get isCityWide() {
      return this.args.subscriptions.CW;
    }

    // eslint-disable-next-line ember/use-brace-expansion
    @computed('isCommunityDistrict', 'args.subscriptions', 'args.email', 'args.invalidEmailForSignup')
    get canBeSubmitted() {
      // If it's an update, subscriptions must be different, or they must have unchecked CD Updates
      if (this.args.isUpdate) {
        if (this.previousIsCommunityDistrict && !this.isCommunityDistrict) return true;
        if (!(Object.entries(this.args.subscriptions).find(([key, value]) => (this.previousSubscriptions[key] !== value)))) return false;
      }

      // Disable signup with existing email addresses
      if (this.args.invalidEmailForSignup) return false;

      if ((this.isCommunityDistrict && !this.isAtLeastOneCommunityDistrictSelected)) return false;
      return this.isEmailValid
            && (this.args.subscriptions.CW
            || (this.isCommunityDistrict && this.isAtLeastOneCommunityDistrictSelected));
    }

    @computed('args.email')
    get isEmailValid() {
      return validateEmail(this.args.email);
    }

    @computed('args.subscriptions')
    get isAtLeastOneCommunityDistrictSelected() {
      return !!Object.entries(this.args.subscriptions).find(([key, value]) => ((key !== 'CW') && value));
    }

    @action
    checkWholeBorough(event) {
      // eslint-disable-next-line no-restricted-syntax
      for (const district of this.communityDistrictsByBorough[event.target.value]) {
        set(this.args.subscriptions, district.code, event.target.checked);
      }
    }

    @action
    closeAllAccordions() {
      $('.accordion').foundation('up', $('.accordion .accordion-content'));
    }

    @action
    toggleCitywide(event) {
      set(this.args.subscriptions, 'CW', event.target.checked);
    }

    @action
    async subscribe() {
      if (!this.canBeSubmitted) { return; }

      set(this, 'isSubmitting', true);

      const requestBody = { email: this.args.email, subscriptions: {} };
      if (this.isCommunityDistrict) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(this.args.subscriptions)) {
          if (value) {
            requestBody.subscriptions[key] = 1;
          }
        }
      } else if (this.args.subscriptions.CW) {
        requestBody.subscriptions.CW = 1;
      }

      if (this.args.isUpdate) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(this.previousSubscriptions)) {
          if (value !== this.args.subscriptions[key]) {
            requestBody.subscriptions[key] = value ? 0 : 1;
          }
        }
      }
      // If it's an update, unsubscribe from all CDs if they unchecked the box
      if (this.args.isUpdate && !this.isCommunityDistrict) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(this.previousSubscriptions)) {
          if ((key !== 'CW') && value) {
            requestBody.subscriptions[key] = 0;
          }
        }
      }

      const response = await fetch(`${ENV.host}/subscribers${this.args.isUpdate ? (`/${this.args.id}`) : ''}`, {
        method: this.args.isUpdate ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      await response.json();

      if (!response.ok) {
        set(this, 'showSubscriptionUpdateConfirmationModal', true);
        set(this, 'updateStatus', 'error');
        throw await response.json();
      }

      if (!this.args.isUpdate) window.location.pathname = '/subscribed';

      set(this, 'isSubmitting', false);

      if (this.args.isUpdate) {
        set(this, 'showSubscriptionUpdateConfirmationModal', true);
        set(this, 'updateStatus', 'success');
      }
    }
}
