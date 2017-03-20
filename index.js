/* eslint-env node */
'use strict';

const DEFAULT_OPTIONS = {
	importFontAwesome: true,
	importIonIcons: true
};
module.exports = {
	name: 'ember-crud-model',
	options: {
		nodeAssets: {
      'tether':{
        import:{
          srcDir: 'dist',
          include: ['css/tether.min.css','js/tether.min.js']
        }
      },
			'bootstrap': function () {
				return {
					import: {
						srcDir: 'dist',
						include: ['css/bootstrap.css','js/bootstrap.js']
					}
				};
			},
			'ionicons': function () {
				return {
					public: {
						srcDir: 'dist',
						destDir: 'assets/ionicons/',
						include: [...this.ionIcons]
					}
				};
			},
			'font-awesome': function () {
				return {
					public: {
						destDir: '/',
						include: [this.fontAwesome[0]]
					},
          import: [this.fontAwesome[1]]
				};
			}
		}
	},
	included: function (app) {
		const options = Object.assign({}, DEFAULT_OPTIONS, app.options['onsen-ui']);
		this.fontAwesome = options.importFontAwesome ? ['fonts/*', 'css/font-awesome.min.css'] : [null,null];
		this.ionIcons = options.importIonIcons ? ['fonts/*', 'css/ionicons.min.css'] : [null, null];
		this._super.included.apply(this, arguments);

	}
};
