import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_main extends Model<InferAttributes<com_main>, InferCreationAttributes<com_main>> {
  declare one: CreationOptional<number>

  static initModel(sequelize: Sequelize.Sequelize): typeof com_main {
    return com_main.init(
      {
        one: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'com_main',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'one' }],
          },
        ],
      }
    )
  }
}
