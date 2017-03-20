/*global $*/
import Ember from 'ember';
import layout from '../templates/components/crud-table';

export default Ember.Component.extend({
  layout,
  tagName:'table',
  classNames:["table"],
  classHeaders:[],
  actions:{
    edit(record){
      this.attrs.edit(record);
    },
    delete(record){
      this.attrs.delete(record);
    },
    toggleSort(sortable){
      this.attrs.toggleSort(sortable);
    }
  },
  didRender(){
    $('[data-toggle=tooltip]').tooltip('dispose');
    $('[data-toggle=tooltip]').tooltip();
  }
});
