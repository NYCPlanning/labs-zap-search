import { action, computed } from '@ember-decorators/object';
import { restartableTask, keepLatestTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { isArray } from '@ember/array';
import ENV from 'labs-zap-search/config/environment';
import queryString from 'qs';
import turfBbox from '@turf/bbox';
import { generateCircleFromFeet } from 'labs-zap-search/helpers/generate-circle-from-feet';
import GeographyParachuteController from './query-parameters/show-geography';

const DEBOUNCE_MS = 500;
const MAX_PAGES = 30;
/**
 * The ShowGeographyController is an EmberJS controller (with the
 * Ember Parachute addon) which handles the ShowGeographyRoute.
 * It is mostly responsible for the filter query parameters. It also
 * defines some of the mutator methods used to mutate the state of the
 * filter query parameters. Lastly, it includes a number of model-specific
 * computed properties that help manage things like page numbers.
 */
export default class ShowGeographyController extends GeographyParachuteController {
  /**
   * This method is an Ember lifecycle hook, gets fired on initialization of the controller.
   * This fetches data as soon as the controller gets instantiated.
   */
  init(...args) {
    super.init(...args);

    this.fetchData.perform({ unloadAll: true });
  }

  /**
   * Current page number used to paginate the results
   */
  page = 1;

  /**
   * Main property for storing the list of projects to be used in the
   * current view. This is necessary to enable "infinite scroll" functionality
   * seen in the projects list view. This propert is either cleared or
   * added to.
   */
  cachedProjects = [];

  /**
   * List of MapboxGL tile URL templates (/{x}/{y}/{z}.mvt|pbf). Pulled
   * from metadata in the API response.
   */
  tiles = [];

  /**
   * Current map bounding box which is determined by the API in the metadata
   * response object.
   */
  bounds = [];


  /**
   * Ember Parachute hook called when defined query paramters are changed.
   * Here it's used to perform new queries to the database whenever the params
   * change.
   * See https://github.com/offirgolan/ember-parachute#hook---queryparamsdidchange
   */
  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.fetchData.perform({ unloadAll: true });
    }
  }

  /**
   * Computed for determining whether there are any records left according
   * to the API.
   * @returns {Boolean}
   */
  @computed('fetchData.lastSuccessful.value.meta.{pageTotal,total}', 'page')
  get noMoreRecords() {
    const pageTotal = this.get('fetchData.lastSuccessful.value.meta.pageTotal');
    const total = this.get('fetchData.lastSuccessful.value.meta.total');
    const { page } = this;

    return (pageTotal < MAX_PAGES) || ((page * MAX_PAGES) >= total);
  }

  /**
   * Contructs an Ember Data friendly query object to be passed along
   * to calls to the `store`. This constructs an object representing
   * the keys and values of only currently applied filters.
   * @returns {Object}
   */
  @computed('allQueryParams', 'page')
  get appliedQueryParams() {
    // construct query object only with applied params
    const params = this.allQueryParams;
    const { page } = this;
    const {
      'applied-filters': appliedFilters,
    } = params;

    const queryOptions = {
      page,
    };

    appliedFilters.forEach((key) => {
      queryOptions[key] = params[key];
    });

    return queryOptions;
  }

  /**
   * Returns the download URL with the URI serialized `appliedQueryParams` object
   * @returns{String}
   */
  @computed('allQueryParams')
  get downloadURL() {
    // construct query object only with applied params
    const href = `${ENV.host}/projects/download.csv`;
    const queryParams = this.appliedQueryParams;

    return `${href}?${queryString.stringify(queryParams, { arrayFormat: 'bracket' })}`;
  }

  /**
   * Limits the rate at which something can be set, when used. Helps prevent
   * performance issues when binding functions that mutate to MapboxGL events
   * that are triggered continuously/aggressively.
   * @method
   * @private
   */
  @restartableTask
  debouncedSet = function* (key, value) {
    yield timeout(DEBOUNCE_MS);
    this.set(key, value);
  }

  /**
   * Main data fetcher task, calls the store directly. This will attempt
   * to fetch data and add it to a temporary scoped variable, projects.
   * Depending on passed configuration, it will either clear the "cachedProjects"
   * or append more projects to "catchedProjects".
   *
   * This task has a "side effect" and a return value, both are used.
   * The return value is used only in the template. The "side effect" is
   * that cachedProjects gets mutated (`pushObject`).
   *
   * Also extracts map bounds and tile information from the API response metadata.
   * @param {Object} configuration
   * @returns {Object}
   */
  @keepLatestTask
  fetchData = function* ({ unloadAll = false } = {}) {
    const { cachedProjects } = this;
    const queryOptions = this.appliedQueryParams;

    // Temporary variables for store found projects/metadata
    let projects;
    let meta;

    // Query for new projects and grab the metadata from response
    try {
      projects = yield this.store.query('project', queryOptions);
      meta = projects.get('meta');
    } catch (e) {
      this.transitionToRoute('oops');
    }

    // If configured to reset, clear out the "cachedProjects"
    if (unloadAll) {
      this.set('page', 1);
      cachedProjects.clear();
    }

    // If metadata includes tiling and bounds information, continue
    if (meta.tiles && meta.bounds) {
      /*
      * Filtering does not occur until a user has created a point/selected a centroid, even if the filter is turned on.
      * If radius filter is on, and a point exists, indicating the user has actually clicked a point (default is []),
      * use bounding box calculated from radius and point instead of bounding box from response.
      * Check for point existence is also done in filter-distance-from-point.hbs
      */
      if (queryOptions.distance_from_point && queryOptions.distance_from_point.length && queryOptions.radius_from_point) {
        const {
          distance_from_point,
          radius_from_point,
        } = queryOptions;
        const boundingBox = turfBbox(generateCircleFromFeet([distance_from_point, radius_from_point]));

        this.set('bounds', boundingBox);
      } else {
        this.set('bounds', meta.bounds);
      }

      this.set('tiles', meta.tiles);
    }

    // Push the found projects into the cache.
    cachedProjects.pushObjects(projects.toArray());

    // The return value here is used only in the template
    return {
      meta,
      projects: cachedProjects,
    };
  }

  /**
   * Action for passing along address search results to the query parameter.
   * @param {string} key
   * @param {object} GeoJSON fragment
   */
  @action
  handleSearchResultSelect(key, { geometry: { coordinates } }) {
    this.set(key, coordinates);
  }

  /**
   * Action for passing along map clicks in radius filter mode
   * @param {string} key
   * @param {array} lngLat
   */
  @action
  handleRadiusFilterClick(key, lngLat) {
    this.set(key, lngLat);
  }

  /**
   * Public wrapper for debouncedSet
   * @param {string} key
   * @param {object} event
   */
  @action
  setDebouncedValue(key, { target: { value } }) {
    this.debouncedSet.perform(key, value);
  }

  /**
   * Action for resetting all query params to their default state.
   */
  @action
  resetAll() {
    this.resetQueryParams();
  }

  /*
    `mutateArray` "toggles" a set of value(s) against an array, meaning they
    are either removed or added if they're present or absent, respectively.
    @param {string} key
    @param {number[]|string[]|object[]} values
  */
  @action
  mutateArray(key, ...values) {
    // BEWARE: binding this to 'onClick=' will insert the mouseEvent
    const targetArray = this.get(key);

    // ember handlebars can't use spread/rest syntax for actions yet
    // so we check if array is passed
    const unnestedValues = (isArray(values[0]) && values.length === 1) ? values[0] : values;

    // Loop and remove or push based on whether they're present in the array.
    unnestedValues.forEach((value) => {
      if (targetArray.includes(value)) {
        targetArray.removeObject(value);
      } else {
        targetArray.pushObject(value);
      }
    });

    this.set(key, targetArray.sort());
  }

  /**
   * Replaces a property with a newly passed array
   * of "codes", specific to the data schema used in
   * Ember Power Select
   * @param {string} key
   * @param {array} value
   */
  @action
  replaceProperty(key, value = []) {
    this.set(key, value.map(({ code }) => code));
  }

  /**
   * Toggles a boolean property by keyname
   */
  @action
  toggleBoolean(key) {
    this.set(key, !this.get(key));
  }
}
