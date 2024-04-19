import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_loc, now_locId } from './now_loc'
import type { now_proj, now_projId } from './now_proj'

export interface now_plrAttributes {
  lid: number
  pid: number
}

export type now_plrPk = 'lid' | 'pid'
export type now_plrId = now_plr[now_plrPk]
export type now_plrOptionalAttributes = 'lid' | 'pid'
export type now_plrCreationAttributes = Optional<now_plrAttributes, now_plrOptionalAttributes>

export class now_plr extends Model<now_plrAttributes, now_plrCreationAttributes> implements now_plrAttributes {
  declare lid: number
  declare pid: number

  // now_plr belongsTo now_loc via lid
  declare lid_now_loc: now_loc
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>
  // now_plr belongsTo now_proj via pid
  declare pid_now_proj: now_proj
  declare getPid_now_proj: Sequelize.BelongsToGetAssociationMixin<now_proj>
  declare setPid_now_proj: Sequelize.BelongsToSetAssociationMixin<now_proj, now_projId>
  declare createPid_now_proj: Sequelize.BelongsToCreateAssociationMixin<now_proj>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_plr {
    return now_plr.init(
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
        pid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_proj',
            key: 'pid',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_plr',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'pid' }],
          },
          {
            name: 'now_test_plr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'pid' }],
          },
          {
            name: 'now_test_plr_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
