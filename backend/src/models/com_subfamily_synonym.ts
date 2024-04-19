import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_subfamily_synonymAttributes {
  syn_subfamily_name: string
  subfamily_name?: string
}

export type com_subfamily_synonymPk = 'syn_subfamily_name'
export type com_subfamily_synonymId = com_subfamily_synonym[com_subfamily_synonymPk]
export type com_subfamily_synonymOptionalAttributes = 'syn_subfamily_name' | 'subfamily_name'
export type com_subfamily_synonymCreationAttributes = Optional<
  com_subfamily_synonymAttributes,
  com_subfamily_synonymOptionalAttributes
>

export class com_subfamily_synonym
  extends Model<com_subfamily_synonymAttributes, com_subfamily_synonymCreationAttributes>
  implements com_subfamily_synonymAttributes
{
  declare syn_subfamily_name: string
  declare subfamily_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_subfamily_synonym {
    return com_subfamily_synonym.init(
      {
        syn_subfamily_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        subfamily_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_subfamily_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_subfamily_name' }],
          },
        ],
      }
    )
  }
}
