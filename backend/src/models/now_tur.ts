import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_tu_bound, now_tu_boundId } from './now_tu_bound'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_turAttributes {
  bid: number
  rid: number
}

export type now_turPk = 'bid' | 'rid'
export type now_turId = now_tur[now_turPk]
export type now_turOptionalAttributes = 'bid' | 'rid'
export type now_turCreationAttributes = Optional<now_turAttributes, now_turOptionalAttributes>

export class now_tur extends Model<now_turAttributes, now_turCreationAttributes> implements now_turAttributes {
  bid!: number
  rid!: number

  // now_tur belongsTo now_tu_bound via bid
  bid_now_tu_bound!: now_tu_bound
  getBid_now_tu_bound!: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  setBid_now_tu_bound!: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, now_tu_boundId>
  createBid_now_tu_bound!: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>
  // now_tur belongsTo ref_ref via rid
  rid_ref_ref!: ref_ref
  getRid_ref_ref!: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  setRid_ref_ref!: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
  createRid_ref_ref!: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_tur {
    return now_tur.init(
      {
        bid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_tu_bound',
            key: 'bid',
          },
        },
        rid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'ref_ref',
            key: 'rid',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_tur',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'bid' }, { name: 'rid' }],
          },
          {
            name: 'now_test_tur_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'bid' }],
          },
          {
            name: 'now_test_tur_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
