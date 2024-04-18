import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_tu_bound, now_tu_boundId } from './now_tu_bound'
import type { ref_ref, ref_refId } from './ref_ref'

export class now_tur extends Model<InferAttributes<now_tur>, InferCreationAttributes<now_tur>> {
  declare bid: CreationOptional<number>
  declare rid: CreationOptional<number>

  // now_tur belongsTo now_tu_bound via bid
  declare bid_now_tu_bound?: Sequelize.NonAttribute<now_tu_bound>
  declare getBid_now_tu_bound: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  declare setBid_now_tu_bound: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, number>
  declare createBid_now_tu_bound: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>
  // now_tur belongsTo ref_ref via rid
  declare rid_ref_ref?: Sequelize.NonAttribute<ref_ref>
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, number>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

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
