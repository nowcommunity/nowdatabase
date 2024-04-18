import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class now_coll_meth_values extends Model<
  InferAttributes<now_coll_meth_values>,
  InferCreationAttributes<now_coll_meth_values>
> {
  declare coll_meth_value: CreationOptional<string>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_coll_meth_values {
    return now_coll_meth_values.init(
      {
        coll_meth_value: {
          type: DataTypes.STRING(21),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_coll_meth_values',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'coll_meth_value' }],
          },
        ],
      }
    )
  }
}
