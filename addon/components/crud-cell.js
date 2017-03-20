/*global require*/
import Ember from 'ember';
var templates = [];
for (var moduleKey in require._eak_seen) {
	if (moduleKey.indexOf('\/templates\/') !== -1) {
		if (moduleKey.indexOf('crud-model/fields/') > -1) {
			templates.push(moduleKey);
		}
	}
}
export default Ember.Component.extend({
	mode: 'read',
	layoutName: Ember.computed('configuration', 'mode', function () {
    let template = `${this.get('mode')}-${this.get('configuration.type')}`;
    template = templates.any((t)=>t.indexOf(template) > -1) ? template : `${this.get('mode')}-text`;
    return `crud-model/fields/${template}`;
	}),
	tagName: 'td',
	classNameBindings: ['configuration.haswarnings:has-warning:']
});
