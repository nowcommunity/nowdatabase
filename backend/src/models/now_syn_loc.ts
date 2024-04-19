import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_loc, now_locId } from './now_loc'

export interface now_syn_locAttributes {
  syn_id: number
  lid: number
  synonym?: string
}

export type now_syn_locPk = 'syn_id'
export type now_syn_locId = now_syn_loc[now_syn_locPk]
export type now_syn_locOptionalAttributes = 'syn_id' | 'lid' | 'synonym'
export type now_syn_locCreationAttributes = Optional<now_syn_locAttributes, now_syn_locOptionalAttributes>

export class now_syn_loc
  extends Model<now_syn_locAttributes, now_syn_locCreationAttributes>
  implements now_syn_locAttributes
{
  declare syn_id: number
  declare lid: number
  declare synonym?: string

  // now_syn_loc belongsTo now_loc via lid
  declare lid_now_loc: now_loc
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_syn_loc {
    return now_syn_loc.init(
      {
        syn_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        lid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'now_loc',
            key: 'lid',
          },
        },
        synonym: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_syn_loc',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'syn_id' }],
          },
          {
            name: 'now_test_syn_loc_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
