import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_order_synonymAttributes {
  syn_order_name: string
  order_name?: string
}

export type com_order_synonymPk = 'syn_order_name'
export type com_order_synonymId = com_order_synonym[com_order_synonymPk]
export type com_order_synonymOptionalAttributes = 'syn_order_name' | 'order_name'
export type com_order_synonymCreationAttributes = Optional<
  com_order_synonymAttributes,
  com_order_synonymOptionalAttributes
>

export class com_order_synonym
  extends Model<com_order_synonymAttributes, com_order_synonymCreationAttributes>
  implements com_order_synonymAttributes
{
  declare syn_order_name: string
  declare order_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_order_synonym {
    return com_order_synonym.init(
      {
        syn_order_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        order_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_order_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_order_name' }],
          },
        ],
      }
    )
  }
}
