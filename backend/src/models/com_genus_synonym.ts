import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_genus_synonymAttributes {
  syn_genus_name: string
  genus_name?: string
}

export type com_genus_synonymPk = 'syn_genus_name'
export type com_genus_synonymId = com_genus_synonym[com_genus_synonymPk]
export type com_genus_synonymOptionalAttributes = 'syn_genus_name' | 'genus_name'
export type com_genus_synonymCreationAttributes = Optional<
  com_genus_synonymAttributes,
  com_genus_synonymOptionalAttributes
>

export class com_genus_synonym
  extends Model<com_genus_synonymAttributes, com_genus_synonymCreationAttributes>
  implements com_genus_synonymAttributes
{
  syn_genus_name!: string
  genus_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_genus_synonym {
    return com_genus_synonym.init(
      {
        syn_genus_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        genus_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_genus_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_genus_name' }],
          },
        ],
      }
    )
  }
}
