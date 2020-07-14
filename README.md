# objection-paranoia
![npm](https://img.shields.io/npm/v/objection-paranoia.svg)(https://www.npmjs.com/package/objection-paranoia)

Automatically handle soft-deleting with your Objection.js models.

## Installation
Install from npm:

```bash
npm install objection-paranoia
```

Register the plugin with an instance of objection:

```js
const objectionSoftDelete = require('objection-paranoia');
objectionSoftDelete.register(objection);
```


## Configuration
By default, objection-paranoia uses the `deleted_at` attribute for soft-deletes. You can optionally pass in an options object as the second argument to register to specify a custom attribute to use:

```js
objectionSoftDelete.register(objection, {
  columnName: 'deleted_at',
});
```
## Options
columnName: the name of the column to use as the soft delete flag on the model (Default: 'deleted_at'). The column must exist on the table for the model.

You can specify different column names per-model by using the options:

```js
objectionSoftDelete.register(objection, {
  columnName: 'deleted_at',
  deletedValue: new Date() | knex.fn.now(),
  notDeletedValue: null | true | false,
});
```
deletedValue: you can set this option to allow a different value than "new Date()" to be set in the specified column. For instance, you can use the following code to make a timestamp (you need knex instance to do so)

```js
objectionSoftDelete.register(objection, {
  columnName: 'deleted_at',
  deletedValue: new Date() | knex.fn.now(),
});
```

notDeletedValue: you can set (and should) this option along with deletedValue to allow a different value than "null" to be set in the specified column. For instance, you can use the following code to restore the column to null (you need knex instance to do so)

```js
objectionSoftDelete.register(objection, {
  columnName: 'deleted_at',
  deletedValue: new Date() | knex.fn.now(),
  notDeletedValue: null | true | false,
});
```

## Usage
When soft-delete is enabled on a model, the delete timestamp will be set to `new Date()` on deletion.

### Enable soft-delete for a model
Set the `softDelete` static property on your model to true:

```js
class MyModel {
  static get softDelete() {
    return true;
  }
}
```

When softDelete is enabled, all delete queries to this model will instead update the model with a delete timestamp, and all queries to find these models will omit deleted instances.

### Include deleted records in query
```js
MyModel.query().withDeleted();
```

### Force delete
```js
MyModel.query().forceDelete();
```

## Credits
[objection-softdelete](https://github.com/ackerdev/objection-softdelete)
[objection-soft-delete](https://github.com/griffinpp/objection-soft-delete)
