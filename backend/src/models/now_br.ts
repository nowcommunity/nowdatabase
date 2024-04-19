import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_bau, now_bauId } from './now_bau'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_brAttributes {
  buid: number
  rid: number
}

export type now_brPk = 'buid' | 'rid'
export type now_brId = now_br[now_brPk]
export type now_brOptionalAttributes = 'buid' | 'rid'
export type now_brCreationAttributes = Optional<now_brAttributes, now_brOptionalAttributes>

export class now_br extends Model<now_brAttributes, now_brCreationAttributes> implements now_brAttributes {
  declare buid: number
  declare rid: number

  // now_br belongsTo now_bau via buid
  declare bu: now_bau
  declare getBu: Sequelize.BelongsToGetAssociationMixin<now_bau>
  declare setBu: Sequelize.BelongsToSetAssociationMixin<now_bau, now_bauId>
  declare createBu: Sequelize.BelongsToCreateAssociationMixin<now_bau>
  // now_br belongsTo ref_ref via rid
  declare rid_ref_ref: ref_ref
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_br {
    return now_br.init(
      {
        buid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_bau',
            key: 'buid',
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
        tableName: 'now_br',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'buid' }, { name: 'rid' }],
          },
          {
            name: 'now_test_tr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'buid' }],
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
