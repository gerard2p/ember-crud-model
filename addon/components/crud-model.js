import Ember from 'ember';
import layout from '../templates/components/crud-model';
const {set, RSVP} = Ember;
function capitalize (str) {
	return str[0].toUpperCase() + str.substring(1);
}
const fieldOptions = {
	list: true,
	create: true,
	update: true,
	delete: true,
	display: true,
	type: 'text',
	default: null,
	required: false,
	haswarnings: false,
	sort: true,
	search: false
};

export default Ember.Mixin.create({
	layout,
	tagName: 'section',
	fields: true,
	refresh: true,
	model: null,
	datamodel: null,
	fetch() {
		let deferred = this.wait('read', 'loading');
		this.paginator.query(this.query.body);
		this.read(this.query.body, deferred);
		deferred.promise.then(records => {
			this.paginator.extractMeta(records);
			set(this, 'datamodel', records);
		});
	},
	query: {body: {}},
	selectedItem: null,
	searchProperty: null,
	searchTerm: null,
	mode: 'read',
	actions: {
		setLimit(limit) {
			this.paginator.set('limit', limit);
			this.fetch();
		},
		child() {
			return this;
		},
		goto(page) {
			if (page) {
				this.paginator.query(this.query.body, page);
				this.fetch();
			}
		},
		cancel() {
			let record = this.get('selectedItem');
			if (record.get('isNew')) {
				this.datamodel.removeObject(record);
				record.deleteRecord();
			}
			if (record.get('isDirty')) {
				record.rollback();
			}
			this.set('selectedItem', null);
			this.set('mode', null);
		},
		edit(record) {
			this.set('selectedItem', record);
			this.set('mode', 'update');
		},
		delete(record) {
			this.set('selectedItem', record);
			this.set('mode', 'delete');
		},
		createRecord() {
			let wait = this.wait('newRecord');
			this._targetObject.actions.record.bind(this._targetObject)(wait);
			wait.promise.then((record) => {
				this.set('selectedItem', record);
				this.datamodel.pushObject(record._internalModel);
				this.set('mode', 'create');
			});
		},
		refresh() {
			this.fetch();
		},
		toggleField(fieldconfig) {
			set(fieldconfig, 'display', !fieldconfig.display);
		},
		searchField(field) {
			this.set('searchProperty', field);
		},
		searchLocal() {
			let term = this.get('searchTerm');
			let property = this.get('searchProperty');
			let results = [];
			this.datamodel.forEach((record) => {
				if (record.get(property).indexOf(term) > -1) {
					results.push(record);
				}
			});
			this.set('original_model', this.get('datamodel'));
			this.set('datamodel', results);
		},
		clearSearch() {
			this.set('datamodel', this.get('original_model'));
			this.set('original_model', null);
			this.set('searchTerm', null);
		},
		toggleSort(field) {
			let sort = this.get(`model.${field}.sort`);
			Object.keys(this.model).forEach((key) => {
				let data = this.model[key];
				if (data.sort) {
					set(data, 'sort', 'sort');
				}
			});
			if (sort.indexOf('desc') > -1) {
				sort = 'sort-asc';
			} else if (sort.indexOf('asc') > -1) {
				sort = 'sort';
			} else {
				sort = 'sort-desc';
			}
			this.set(`model.${field}.sort`, sort);
			clearTimeout(this.get('waitforsort'));
			this.set('waitforsort', setTimeout(() => {
				delete this.query.body.sort;
				if (sort !== 'sort') {
          this.paginator.sort(this.query.body, field, sort==='sort-desc'?1:0);
				}
				this.fetch();
			}, 1300));
		}

	},
	findDefaultAction(action) {
		if (!this.attrs[action] && !!this._targetObject.actions[action]) {
			this[action] = this.attrs[action] = this._targetObject.actions[action].bind(this._targetObject);
		}
	},
	wait(id, toggle = '' ) {
		set(this, toggle, true);
		let deferred = RSVP.defer(`crud-model#${id}`);
		deferred.promise.catch(err => {
			set(this, toggle, false);
			return err;
		}).then((r) => {
			set(this, toggle, false);
			return r;
		});
		return deferred;
	},
	init() {
		this._super(...arguments);
		for (let field of Object.keys(this.model)) {
			this.model[field] = Object.assign({}, fieldOptions, this.model[field]);
			this.model[field].label = this.model[field].label || capitalize(field);
			if (this.model[field].search && !this.get('searchProperty')) {
				this.set('searchProperty', field);
			}
			if (this.model[field].sort) {
				this.model[field].sort = 'sort';
			}
		}
		['create', 'read', 'update', 'delete', 'errorParser'].forEach(action => this.findDefaultAction(action));
	},
	didReceiveAttrs() {
		this._super(...arguments);
		this.fetch();
	}
});
