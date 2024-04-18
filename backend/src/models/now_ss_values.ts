import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface now_ss_valuesAttributes {
  ss_value: string
  category?: string
}

export type now_ss_valuesPk = 'ss_value'
export type now_ss_valuesId = now_ss_values[now_ss_valuesPk]
export type now_ss_valuesOptionalAttributes = 'ss_value' | 'category'
export type now_ss_valuesCreationAttributes = Optional<now_ss_valuesAttributes, now_ss_valuesOptionalAttributes>

export class now_ss_values
  extends Model<now_ss_valuesAttributes, now_ss_valuesCreationAttributes>
  implements now_ss_valuesAttributes
{
  ss_value!: string
  category?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof now_ss_values {
    return now_ss_values.init(
      {
        ss_value: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        category: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_ss_values',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'ss_value' }],
          },
        ],
      }
    )
  }
}
