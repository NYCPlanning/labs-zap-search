import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize() {
    // This is how to call super, as Mirage borrows [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);
    // Add metadata, sort parts of the response, etc.
    json.meta = {
      total: 29,
      pageTotal: 29,
      tiles: ['https://tiles.planninglabs.nyc/data/v3/12/1206/1539.pbf'],
      bounds: [[-73.9916082509177, 40.6824244259472],[-73.8847869770557, 40.8933091086328]],
    };

    return json;
  }
});
