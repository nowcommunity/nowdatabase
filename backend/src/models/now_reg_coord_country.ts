import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_reg_coord, now_reg_coordId } from './now_reg_coord'

export interface now_reg_coord_countryAttributes {
  reg_coord_id: number
  country: string
}

export type now_reg_coord_countryPk = 'reg_coord_id' | 'country'
export type now_reg_coord_countryId = now_reg_coord_country[now_reg_coord_countryPk]
export type now_reg_coord_countryOptionalAttributes = 'reg_coord_id' | 'country'
export type now_reg_coord_countryCreationAttributes = Optional<
  now_reg_coord_countryAttributes,
  now_reg_coord_countryOptionalAttributes
>

export class now_reg_coord_country
  extends Model<now_reg_coord_countryAttributes, now_reg_coord_countryCreationAttributes>
  implements now_reg_coord_countryAttributes
{
  declare reg_coord_id: number
  declare country: string

  // now_reg_coord_country belongsTo now_reg_coord via reg_coord_id
  declare reg_coord: now_reg_coord
  declare getReg_coord: Sequelize.BelongsToGetAssociationMixin<now_reg_coord>
  declare setReg_coord: Sequelize.BelongsToSetAssociationMixin<now_reg_coord, now_reg_coordId>
  declare createReg_coord: Sequelize.BelongsToCreateAssociationMixin<now_reg_coord>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_reg_coord_country {
    return now_reg_coord_country.init(
      {
        reg_coord_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_reg_coord',
            key: 'reg_coord_id',
          },
        },
        country: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_reg_coord_country',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }, { name: 'country' }],
          },
          {
            name: 'now_test_reg_coord_country_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }],
          },
        ],
      }
    )
  }
}
