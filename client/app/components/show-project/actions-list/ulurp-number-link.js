import Component from '@ember/component';
import ENV from 'labs-zap-search/config/environment';

ACTION_STATUSCODE_ACTIVE = 1;

/**
 * @param {Action Object} action
 */
export default class UlurpNumberLinkComponent extends Component {
  host = ENV.host;

  actionStatuscodeActive = ACTION_STATUSCODE_ACTIVE;

  get serverRelativeUrl () {
    const serverRelativeFolderUrl = this.action.dcpSpabsoluteurl.replace('https://nyco365.sharepoint.com', '');
    const ulurpNumber = this.action.dcpUlurpnumber;

    // for ulurp numbers that have a letter at the end of the 6 numbers to represent the version (ex. the "A" in C18005AZMX)
    // pull 6 numbers AND next character after the last number
    const ulurpNumberWithLetter = (ulurpNumber.match(/(\d+)./g)[0]).toLowerCase();
    const ulurpNumberWithoutLetter = ulurpNumber.match(/\d+/g)[0]; // pull 100149 from C100149ZSM

    // the ulurp numbers with that extra letter have overall 11 characters compared to the usual 10
    if (ulurpNumber.length > 10) {
      return `${serverRelativeFolderUrl}/${ulurpNumberWithLetter}.pdf`;
    }

    return `${serverRelativeFolderUrl}/${ulurpNumberWithoutLetter}.pdf`;
  }
}
