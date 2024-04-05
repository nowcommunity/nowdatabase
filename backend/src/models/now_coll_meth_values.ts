import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface now_coll_meth_valuesAttributes {
  coll_meth_value: string
}

export type now_coll_meth_valuesPk = 'coll_meth_value'
export type now_coll_meth_valuesId = now_coll_meth_values[now_coll_meth_valuesPk]
export type now_coll_meth_valuesCreationAttributes = now_coll_meth_valuesAttributes

export class now_coll_meth_values
  extends Model<now_coll_meth_valuesAttributes, now_coll_meth_valuesCreationAttributes>
  implements now_coll_meth_valuesAttributes
{
  coll_meth_value!: string

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
