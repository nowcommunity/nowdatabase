import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_tau, now_tauId } from './now_tau'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_trAttributes {
  tuid: number
  rid: number
}

export type now_trPk = 'tuid' | 'rid'
export type now_trId = now_tr[now_trPk]
export type now_trOptionalAttributes = 'tuid' | 'rid'
export type now_trCreationAttributes = Optional<now_trAttributes, now_trOptionalAttributes>

export class now_tr extends Model<now_trAttributes, now_trCreationAttributes> implements now_trAttributes {
  tuid!: number
  rid!: number

  // now_tr belongsTo now_tau via tuid
  tu!: now_tau
  getTu!: Sequelize.BelongsToGetAssociationMixin<now_tau>
  setTu!: Sequelize.BelongsToSetAssociationMixin<now_tau, now_tauId>
  createTu!: Sequelize.BelongsToCreateAssociationMixin<now_tau>
  // now_tr belongsTo ref_ref via rid
  rid_ref_ref!: ref_ref
  getRid_ref_ref!: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  setRid_ref_ref!: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
  createRid_ref_ref!: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_tr {
    return now_tr.init(
      {
        tuid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_tau',
            key: 'tuid',
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
        tableName: 'now_tr',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'tuid' }, { name: 'rid' }],
          },
          {
            name: 'now_test_tr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'tuid' }],
          },
          {
            name: 'now_test_tr_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
