import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_loc, now_locId } from './now_loc'

export interface now_coll_methAttributes {
  lid: number
  coll_meth: string
}

export type now_coll_methPk = 'lid' | 'coll_meth'
export type now_coll_methId = now_coll_meth[now_coll_methPk]
export type now_coll_methOptionalAttributes = 'lid'
export type now_coll_methCreationAttributes = Optional<now_coll_methAttributes, now_coll_methOptionalAttributes>

export class now_coll_meth
  extends Model<now_coll_methAttributes, now_coll_methCreationAttributes>
  implements now_coll_methAttributes
{
  declare lid: number
  declare coll_meth: string

  // now_coll_meth belongsTo now_loc via lid
  declare lid_now_loc: now_loc
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_coll_meth {
    return now_coll_meth.init(
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
        coll_meth: {
          type: DataTypes.STRING(21),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_coll_meth',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'coll_meth' }],
          },
          {
            name: 'now_test_coll_meth_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
