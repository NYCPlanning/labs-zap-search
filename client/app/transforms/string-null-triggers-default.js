import DS from 'ember-data';

// in Ember data, an undefined value triggers an
// attribute's defaultValue. nulls, however, do not.
// this transform treats null as undefineds so that
// defaultValue is triggered.
export default DS.Transform.extend({
  deserialize(serialized) { return serialized || undefined; },

  serialize(deserialized) { return deserialized; },
});
