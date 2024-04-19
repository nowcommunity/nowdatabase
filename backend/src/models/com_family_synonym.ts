import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_family_synonymAttributes {
  syn_family_name: string
  family_name?: string
}

export type com_family_synonymPk = 'syn_family_name'
export type com_family_synonymId = com_family_synonym[com_family_synonymPk]
export type com_family_synonymOptionalAttributes = 'syn_family_name' | 'family_name'
export type com_family_synonymCreationAttributes = Optional<
  com_family_synonymAttributes,
  com_family_synonymOptionalAttributes
>

export class com_family_synonym
  extends Model<com_family_synonymAttributes, com_family_synonymCreationAttributes>
  implements com_family_synonymAttributes
{
  declare syn_family_name: string
  declare family_name?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_family_synonym {
    return com_family_synonym.init(
      {
        syn_family_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        family_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_family_synonym',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_family_name' }],
          },
        ],
      }
    )
  }
}
