### Sequelize models

The sequelize model definitions in `backend/src/models` were generated automatically by [sequelize-auto](https://github.com/sequelize/sequelize-auto). This generates the model files from the database, plus an `init-models.ts` file, which exports initModels-function that you can use to initialize all models. So to access database, you simply import `models` from utils/db.ts.

This has a [problem](https://github.com/nowcommunity/nowdatabase/issues/15), however. For now, we need to use raw queries: `raw: true` otherwise the fields are not accessible. This may be fixed in future.