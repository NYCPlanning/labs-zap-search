import DS from 'ember-data';
import ENV from 'labs-applicant-maps/config/environment';
const { JSONAPIAdapter } = DS;


export default class ApplicationAdapter extends JSONAPIAdapter {
  _ajaxRequest() {
    if (window.FakeXMLHttpRequest) {
      window.XMLHttpRequest = window.XMLHttpRequestFake;
    }

    super._ajaxRequest(...arguments);
  }

  host = ENV.host;
}
