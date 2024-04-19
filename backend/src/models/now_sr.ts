import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_sau, now_sauId } from './now_sau'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_srAttributes {
  suid: number
  rid: number
}

export type now_srPk = 'suid' | 'rid'
export type now_srId = now_sr[now_srPk]
export type now_srOptionalAttributes = 'suid' | 'rid'
export type now_srCreationAttributes = Optional<now_srAttributes, now_srOptionalAttributes>

export class now_sr extends Model<now_srAttributes, now_srCreationAttributes> implements now_srAttributes {
  declare suid: number
  declare rid: number

  // now_sr belongsTo now_sau via suid
  declare su: now_sau
  declare getSu: Sequelize.BelongsToGetAssociationMixin<now_sau>
  declare setSu: Sequelize.BelongsToSetAssociationMixin<now_sau, now_sauId>
  declare createSu: Sequelize.BelongsToCreateAssociationMixin<now_sau>
  // now_sr belongsTo ref_ref via rid
  declare rid_ref_ref: ref_ref
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sr {
    return now_sr.init(
      {
        suid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_sau',
            key: 'suid',
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
        tableName: 'now_sr',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'suid' }, { name: 'rid' }],
          },
          {
            name: 'now_test_sr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'suid' }],
          },
          {
            name: 'now_test_sr_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
