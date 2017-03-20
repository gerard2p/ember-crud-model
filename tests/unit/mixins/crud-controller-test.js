import Ember from 'ember';
import CrudControllerMixin from 'ember-crud-model/mixins/crud-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | crud controller');

// Replace this with your real tests.
test('it works', function(assert) {
  let CrudControllerObject = Ember.Object.extend(CrudControllerMixin);
  let subject = CrudControllerObject.create();
  assert.ok(subject);
});
