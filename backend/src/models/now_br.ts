import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_bau, now_bauId } from './now_bau'
import type { ref_ref, ref_refId } from './ref_ref'

export class now_br extends Model<InferAttributes<now_br>, InferCreationAttributes<now_br>> {
  declare buid: CreationOptional<number>
  declare rid: CreationOptional<number>

  // now_br belongsTo now_bau via buid
  declare bu?: Sequelize.NonAttribute<now_bau>
  declare getBu: Sequelize.BelongsToGetAssociationMixin<now_bau>
  declare setBu: Sequelize.BelongsToSetAssociationMixin<now_bau, number>
  declare createBu: Sequelize.BelongsToCreateAssociationMixin<now_bau>
  // now_br belongsTo ref_ref via rid
  declare rid_ref_ref?: Sequelize.NonAttribute<ref_ref>
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, number>
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
