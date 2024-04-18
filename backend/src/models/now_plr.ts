import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_loc, now_locId } from './now_loc'
import type { now_proj, now_projId } from './now_proj'

export class now_plr extends Model<InferAttributes<now_plr>, InferCreationAttributes<now_plr>> {
  declare lid: CreationOptional<number>
  declare pid: CreationOptional<number>

  // now_plr belongsTo now_loc via lid
  declare lid_now_loc?: Sequelize.NonAttribute<now_loc>
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, number>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>
  // now_plr belongsTo now_proj via pid
  declare pid_now_proj?: Sequelize.NonAttribute<now_proj>
  declare getPid_now_proj: Sequelize.BelongsToGetAssociationMixin<now_proj>
  declare setPid_now_proj: Sequelize.BelongsToSetAssociationMixin<now_proj, number>
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
