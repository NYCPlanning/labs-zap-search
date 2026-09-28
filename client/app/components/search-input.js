import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import ENV from 'labs-zap-search/config/environment';

const DEBOUNCE_MS = 100;
const DEFAULT_HOST = 'https://search-api-production.herokuapp.com';
const DEFAULT_ROUTE = 'search';
const DEFAULT_HELPERS = ['geosearch', 'city-map-street-search', 'city-map-alteration'];
const TYPE_TITLE_LOOKUP = {
  lot: 'Lot',
};

// Replaces the third-party `labs-ember-search` addon's `{{labs-search}}` component,
// which called `this.cancel()` (a method that only exists on task instances, not on
// components) whenever a search term was under two characters -- this threw on every
// render, since the component always starts with an empty search term.
export default class SearchInputComponent extends Component {
  @tracked searchTerms = '';

  @tracked results = [];

  @tracked selectedIndex = 0;

  @tracked focused = false;

  get config() {
    return ENV['labs-search'] || {};
  }

  get endpoint() {
    const { config } = this;
    const host = config.host || DEFAULT_HOST;
    const route = config.route || DEFAULT_ROUTE;
    const helpers = (config.helpers || DEFAULT_HELPERS)
      .map(helper => `helpers[]=${helper}&`)
      .join('');

    return `${host}/${route}?${helpers}q=${encodeURIComponent(this.searchTerms)}`;
  }

  get groupedResults() {
    const groups = [];
    const groupsByTitle = {};

    this.results.forEach((result) => {
      const title = TYPE_TITLE_LOOKUP[result.type] || 'Result';

      if (!groupsByTitle[title]) {
        groupsByTitle[title] = { title, rows: [] };
        groups.push(groupsByTitle[title]);
      }

      groupsByTitle[title].rows.push(result);
    });

    return groups;
  }

  searchTask = task(function* () {
    const { searchTerms } = this;

    if (searchTerms.length < 2) {
      this.results = [];
      return;
    }

    yield timeout(DEBOUNCE_MS);

    const response = yield fetch(this.endpoint);
    const resultList = yield response.json();

    this.results = resultList.map((result, index) => ({ ...result, id: index }));
  }).restartable();

  @action
  updateSearchTerms(event) {
    this.searchTerms = event.target.value;
    this.selectedIndex = 0;
    this.searchTask.perform();
  }

  @action
  handleFocusIn() {
    this.focused = true;
  }

  @action
  handleFocusOut() {
    this.focused = false;
  }

  @action
  clear() {
    this.searchTerms = '';
    this.results = [];

    if (this.args.onClear) {
      this.args.onClear();
    }
  }

  @action
  selectResult(result) {
    this.searchTerms = result.label;
    this.results = [];
    this.selectedIndex = 0;

    if (this.args.onSelect) {
      this.args.onSelect(result);
    }
  }

  @action
  handleKeydown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.selectedIndex < this.results.length - 1) {
        this.selectedIndex += 1;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.selectedIndex > 0) {
        this.selectedIndex -= 1;
      }
    } else if (event.key === 'Enter') {
      const result = this.results[this.selectedIndex];
      if (result) {
        this.selectResult(result);
      }
    } else if (event.key === 'Escape') {
      this.clear();
      this.handleFocusOut();
    }
  }
}
