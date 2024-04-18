import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface now_regional_cultureAttributes {
  regional_culture_id: string
  regional_culture_name: string
}

export type now_regional_culturePk = 'regional_culture_id'
export type now_regional_cultureId = now_regional_culture[now_regional_culturePk]
export type now_regional_cultureOptionalAttributes = 'regional_culture_id' | 'regional_culture_name'
export type now_regional_cultureCreationAttributes = Optional<
  now_regional_cultureAttributes,
  now_regional_cultureOptionalAttributes
>

export class now_regional_culture
  extends Model<now_regional_cultureAttributes, now_regional_cultureCreationAttributes>
  implements now_regional_cultureAttributes
{
  regional_culture_id!: string
  regional_culture_name!: string

  static initModel(sequelize: Sequelize.Sequelize): typeof now_regional_culture {
    return now_regional_culture.init(
      {
        regional_culture_id: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        regional_culture_name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'now_regional_culture',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'regional_culture_id' }],
          },
        ],
      }
    )
  }
}
