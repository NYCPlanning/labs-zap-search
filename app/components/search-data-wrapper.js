import Component from '@ember/component';
import carto from 'cartobox-promises-utility/utils/carto';

export default class SearchDataWrapperComponent extends Component {
  constructor() {
    super(...arguments);

    carto.SQL('SELECT ST_Simplify(the_geom, 0.001) as the_geom, displaynam FROM community_districts_v0', 'geojson')
      .then(result => {
        this.set('communityDistricts', result);
      })
  }

  communityDistricts = null

}
