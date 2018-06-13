import DS from 'ember-data';
const { JSONAPIAdapter } = DS;

export default class ApplicationAdapter extends JSONAPIAdapter {
  _ajaxRequest() {
    if (window.FakeXMLHttpRequest) {
      window.XMLHttpRequest = window.XMLHttpRequestFake;
    }

    super._ajaxRequest(...arguments);
  }
}
