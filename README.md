# ember-crud-model

This addon will the successor for ember-cli-crudtable. When version 1.0.0 of this components hits, I will deprecate ember-cli-crudtable.

## why?
ember-cli-crudtable was originally written for ember 1.8 a lot of improvements have been done since that.
so this addon is mean to be more efficient, rendering few elements using less memory and using some of the new ember improvements.
I'm also going to use bootstrao 4 and font-awesome.
So hopefully this will make ember-crud-model a best component for creatng fast crud-tables/maintenace tables.

Greetings,
Gerardo Pérez Pérez
--Born with USB umbilical cord.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-crud-model`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
#ember-cli-build
```
options = {
  importFontAwesome: true,
  importIonIcons: true,
  importBootstrap: true
}
```
# Controller
## actions
1. read
1. create
1. update
1. delete
 
# Components
## base-model
This value is used to know wich is the model to make the request against.
## crud-model
This is the main component and can be used more than one time per view.
### arguments
1. **tagName** (string: "section") kind of html element to render the wrapper.
1. **fields** (boolean: true) Show a dropdown to filter visible fields.
1. **refresh** (boolean: true) Show a button to refresh the current view.
1. **entityName** (string: null) The name wich will identify the model.

# Data Templates
All templates are stored in templates/crud-model. if ther is no template for the selected data type 'text' template will be the default.
## Read templates
These templates are used to only display data.
1.fields/read-text

## Edit templates
These templates are used to edit data either create or update action.
1. fields/edit-text

# paginator
### Properties
1. slots (number: 3) Number of item that will be displayed before break.
1. slotsSiblings (number: 1) Number of item that will be displayed before break.
### Methods
1. extractMeta (response)
1. sort (query, field, value: 0)
1. query (query, page: 0)
