import Component from '@ember/component';
import { action, computed } from '@ember/object';
import ENV from 'labs-zap-search/config/environment';
import { inject as service } from '@ember/service';
import { returnCodeVerifier, createCodeChallenge } from '../../utils/pkce';

/* eslint-disable no-unused-vars */
const MAINTENANCE_RANGE = ENV.maintenanceTimes;

export default class LoginDialogComponent extends Component {
  @service
  session;

  get isMaintenancePeriod() {
    const [start, end] = MAINTENANCE_RANGE.map(string => new Date(string));
    const now = new Date();

    return now > start && now < end;
  };

  @action
  async signIn() {
    const codeVerifier = returnCodeVerifier();
    const codeChallenge = await createCodeChallenge(codeVerifier);
    this.session.set(`data.codeVerifier`, codeVerifier);
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    window.location.assign(
      `${ENV.OAUTH_ENDPOINT}&redirect_uri=${redirectUri}` +
      `&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=openid%20email`
    );
  }

  get hasUpcomingMaintenance() {
    const [start, end] = MAINTENANCE_RANGE.map(string => new Date(string));
    const now = new Date();

    return now < start;
  };
}
