import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_mlist, com_mlistId } from './com_mlist'
import type { now_loc, now_locId } from './now_loc'

export interface now_musAttributes {
  lid: number
  museum: string
}

export type now_musPk = 'lid' | 'museum'
export type now_musId = now_mus[now_musPk]
export type now_musOptionalAttributes = 'lid' | 'museum'
export type now_musCreationAttributes = Optional<now_musAttributes, now_musOptionalAttributes>

export class now_mus extends Model<now_musAttributes, now_musCreationAttributes> implements now_musAttributes {
  declare lid: number
  declare museum: string

  // now_mus belongsTo com_mlist via museum
  declare museum_com_mlist: com_mlist
  declare getMuseum_com_mlist: Sequelize.BelongsToGetAssociationMixin<com_mlist>
  declare setMuseum_com_mlist: Sequelize.BelongsToSetAssociationMixin<com_mlist, com_mlistId>
  declare createMuseum_com_mlist: Sequelize.BelongsToCreateAssociationMixin<com_mlist>
  // now_mus belongsTo now_loc via lid
  declare lid_now_loc: now_loc
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_mus {
    return now_mus.init(
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
        museum: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
          references: {
            model: 'com_mlist',
            key: 'museum',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_mus',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'museum' }],
          },
          {
            name: 'now_test_mus_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
          {
            name: 'now_test_mus_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'museum' }],
          },
        ],
      }
    )
  }
}
