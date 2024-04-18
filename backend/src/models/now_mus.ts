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
  lid!: number
  museum!: string

  // now_mus belongsTo com_mlist via museum
  museum_com_mlist!: com_mlist
  getMuseum_com_mlist!: Sequelize.BelongsToGetAssociationMixin<com_mlist>
  setMuseum_com_mlist!: Sequelize.BelongsToSetAssociationMixin<com_mlist, com_mlistId>
  createMuseum_com_mlist!: Sequelize.BelongsToCreateAssociationMixin<com_mlist>
  // now_mus belongsTo now_loc via lid
  lid_now_loc!: now_loc
  getLid_now_loc!: Sequelize.BelongsToGetAssociationMixin<now_loc>
  setLid_now_loc!: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  createLid_now_loc!: Sequelize.BelongsToCreateAssociationMixin<now_loc>

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
