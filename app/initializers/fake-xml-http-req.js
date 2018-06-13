export function initialize() {
  if (window.FakeXMLHttpRequest) {
    window.XMLHttpRequestFake = window.XMLHttpRequest;
  }
}

export default {
  initialize
};
