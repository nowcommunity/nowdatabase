import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_lau, now_lauId } from './now_lau'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_lrAttributes {
  luid: number
  rid: number
}

export type now_lrPk = 'luid' | 'rid'
export type now_lrId = now_lr[now_lrPk]
export type now_lrOptionalAttributes = 'luid' | 'rid'
export type now_lrCreationAttributes = Optional<now_lrAttributes, now_lrOptionalAttributes>

export class now_lr extends Model<now_lrAttributes, now_lrCreationAttributes> implements now_lrAttributes {
  declare luid: number
  declare rid: number

  // now_lr belongsTo now_lau via luid
  declare lu: now_lau
  declare getLu: Sequelize.BelongsToGetAssociationMixin<now_lau>
  declare setLu: Sequelize.BelongsToSetAssociationMixin<now_lau, now_lauId>
  declare createLu: Sequelize.BelongsToCreateAssociationMixin<now_lau>
  // now_lr belongsTo ref_ref via rid
  declare rid_ref_ref: ref_ref
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_lr {
    return now_lr.init(
      {
        luid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_lau',
            key: 'luid',
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
        tableName: 'now_lr',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'luid' }, { name: 'rid' }],
          },
          {
            name: 'now_test_lr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'luid' }],
          },
          {
            name: 'now_test_lr_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
