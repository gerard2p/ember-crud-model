import Ember from 'ember';
import crudModel from 'ember-crud-model/components/crud-model';
import paginator from '../crud-model/paginator';

export default Ember.Component.extend(crudModel, {
	paginator: paginator.create()
})
