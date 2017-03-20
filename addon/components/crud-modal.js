/*global $*/
import Ember from 'ember';
import layout from '../templates/components/crud-modal';
const {set , computed} = Ember;

function validateform (configuration, element) {
	try {
		for (const input of element.querySelectorAll('input')) {
			if (input.type === 'submit') {
				continue;
			}
			let prop = configuration[input.attributes.name.nodeValue];
			set(prop, 'haswarnings', !input.checkValidity());
		}
		return element.checkValidity();
	} catch (e) {
		return !!window.callPhantom;
	}
}
export default Ember.Component.extend({
	layout,
	mode: 'read',
	mode_create: computed('mode', function () {
		return this.mode === 'create';
	}),
	mode_update: computed('mode', function () {
		return this.mode === 'update';
	}),
	mode_delete: computed('mode', function () {
		return this.mode === 'delete';
	}),
	actions: {
		cancel() {
			this.attrs.cancel();
		},
		validate() {
			let deferred = null;
			switch (this.get('mode')) {
				case 'create':
				case 'update':
					$('#crud-model-alert').collapse('hide');
					if (validateform(this.get('fields'), this.element.querySelector('form'))) {
						deferred = this.attrs.parent().wait(this.get('mode'), 'loading');
						this.get(this.get('mode'))(this.get('model'), deferred);
					} else {
						this.element.querySelector('[type=submit]').click();
					}
					break;
				case 'delete': deferred = this.attrs.parent().wait(this.get('mode'), 'loading');
					this.get(this.get('mode'))(this.get('model'), deferred);
					break;
			}
			if (deferred) {
				deferred.promise.catch((err) => {
					let message = this.get('errorParser')(err);
					$('#crud-model-alert').html(message);
					$('#crud-model-alert').collapse('show');
				}).then(() => {
					$('#crud-model-modal').modal('hide');
          this.attrs.parent().fetch();
				});
			}
		}
	},
	init() {
		this._super(arguments);
	},
	didRender() {
		$(this.element).on('hidden.bs.modal', () => {
			$('#crud-model-alert').collapse('hide');
		});
		$(this.element).on('show.bs.modal', () => {
			this.set('parent', this.attrs.parent());
			this.set('mode', this.attrs.parent().get('mode'));
			this.set('model', this.attrs.parent().get('selectedItem'));
		});
	}
});
