module.exports = {
  register(objection, options = {}) {
    const {
      columnName = 'deleted_at',
      deletedValue= new Date(),
      notDeletedValue = null
    } = options;

    class SoftDeleteQueryBuilder extends objection.QueryBuilder {
      constructor(modelClass) {
        super(modelClass)


        if (modelClass.softDelete) {
          this.onBuild(q => {
            const isUpsert = q._operations.filter((operator) => operator.name === 'upsertGraph').length > 0;
            if (!isUpsert && q.isFind() && !q.context().includeDeleted) {
              q.where(`${q.tableRefFor(modelClass)}.${columnName}`, notDeletedValue);
            }
          });
        }
      }

      withDeleted() {
        return this.context({ includeDeleted: true });
      }

      delete(...args) {
        if (this.modelClass().softDelete) {
          return super.patch({ [columnName]: deletedValue });
        }

        return super.delete(...args);
      }

      forceDelete(...args) {
        return super.delete(...args);
      }
    }

    objection.QueryBuilder = SoftDeleteQueryBuilder;
    objection.Model.QueryBuilder = SoftDeleteQueryBuilder;
    objection.Model.RelatedQueryBuilder = SoftDeleteQueryBuilder;
  }
};