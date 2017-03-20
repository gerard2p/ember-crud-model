import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		errorParser(err){
			return err.message;
		},
		record(deffered) {
			deffered.resolve(this.store.createRecord(this.get('base-model')));
		},
		create(record, deferred) {
			if (record.get('isNew')) {
				record.save().then(deferred.resolve, deferred.reject);
			}
		},
		read(query, deferred) {
			this.store.query(this.get('base-model'), query).then(deferred.resolve, deferred.reject);
		},
		update: function (record, deferred) {
			var promises = [];
			// if(self.this.get('base-model').get('isDirty')){
			promises.push(record.save());
			// }else{
			//	self.set('isEditing',false);
			// }
			// Ember.A(Ember.keys(record._relationships)).any(function (key) {
			//     var value = Ember.get(record, key);
			//     if (value && value.get('isDirty')) {
			//         promises.push(value.get('content').save());
			//     }
			// });
			Ember.RSVP.Promise.all(promises).then(deferred.resolve, deferred.reject);

		},
		delete: function (record, deferred) {
			record.destroyRecord().then(deferred.resolve, deferred.reject);
		}
	}
});
