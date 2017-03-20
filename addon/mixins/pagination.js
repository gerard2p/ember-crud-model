import Ember from 'ember';
export default Ember.Mixin.create({
	sortingString: 'ORDERfield',
	sortingKey: ['', '-'],
	render: Ember.computed('total', function () {
		if (this.total > 0) {
			return true;
		}
		return false;
	}),
	current: 1,
	previous: 0,
	next: 0,
	total: 0,
	pages: 0,
	limit: 10,
	skip: 0,
	from: 0,
	to: 0,
	slots: 3,
	slotsSiblings: 1,
	links: Ember.computed('total', 'pages', 'current', function () {
		let current = this.get('current') - 1;
		let pages = this.get('pages');
		let arr = [];
		let max = this.slotsSiblings * 2 + this.slots;
		let slot_padding = (this.slots - 1) / 2;
		function node (index) {
			arr.push({page: index,current: index === (current + 1)});
		}
		let start = current - slot_padding;
		let siblingStart = start - this.slotsSiblings;
		let end = current + slot_padding + this.slotsSiblings;
		let slots = this.slots;
		let index = 0;
		if (siblingStart < 0) {
			slots -= siblingStart;
			slots++;
		} else {
			for (index = 0; index < this.slotsSiblings && index < pages;index++) {
				node(index + 1);
			}
			index = siblingStart;
		}
		if (index > 1) {
			node('..');
			index = current - slot_padding;
		}
		if (siblingStart === 0) {
			index++;
			slots++;
		}
		for (index; index < (start + slots) && index < pages; index++) {
			node(index + 1);
		}
		if ((index+1) < pages && end < pages) {
			node('..');
			index = pages - this.slotsSiblings;
		}
		for (index; index < pages; index++) {
			node(index + 1);
		}
    if(index<pages){
		while(arr.length < (max + 2)){
			arr.splice(2, 0, {page: start--,current: false});
		}}
		return arr;
	}),
	extractMeta(request) {
		const meta = request.get('meta');
		const nelements = request.get('length');
		this.set('total', meta.total);
		let current = (Math.ceil(this.get('skip') / this.get('limit')) + 1) || 1;
		let pages = (Math.ceil(this.get('total') / this.get('limit'))) || 0;
		this.set('pages', pages);
		this.set('current', current);
		this.set('from', this.get('skip') + 1);
		this.set('to', this.get('from') + nelements - 1);
		this.set('previous', current > 1 ? current - 1 : 0);
		this.set('next', current < pages ? current + 1 : 0);
	},
	sort(query, field, value=0) {
		query.sort =
			this.get('sortingString')
				.replace('field', field)
				.replace('ORDER', this.sortingKey[value]);
	},
	query: function (query, page = 0 ) {
		if (this.limit !== 'All') {
			query.limit = this.get('limit');
			if (page) {
				query.page = page;
			} else {
				page = query.page = this.get('current');
			}
			this.set('skip', this.get('limit') * (page - 1));
		}else{
      delete query.limit;
      delete query.page;
    }
	}
});
