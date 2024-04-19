import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_loc, now_locId } from './now_loc'

export interface now_ssAttributes {
  lid: number
  sed_struct: string
}

export type now_ssPk = 'lid' | 'sed_struct'
export type now_ssId = now_ss[now_ssPk]
export type now_ssOptionalAttributes = 'lid' | 'sed_struct'
export type now_ssCreationAttributes = Optional<now_ssAttributes, now_ssOptionalAttributes>

export class now_ss extends Model<now_ssAttributes, now_ssCreationAttributes> implements now_ssAttributes {
  declare lid: number
  declare sed_struct: string

  // now_ss belongsTo now_loc via lid
  declare lid_now_loc: now_loc
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_ss {
    return now_ss.init(
      {
        lid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_loc',
            key: 'lid',
          },
        },
        sed_struct: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_ss',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'sed_struct' }],
          },
          {
            name: 'now_test_ss_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
